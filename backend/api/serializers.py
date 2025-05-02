from rest_framework import serializers
from .models import Fixture, LeagueTable, PlayMatch, Player, Position, Ground, Team, GroundImage, Event, News, Sponser, Season
from django.conf import settings

class SeasonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Season
        fields = ['id', 'name']


class GroundImageSerializer(serializers.ModelSerializer):

    ground_img = serializers.ImageField()


    class Meta:
        model = GroundImage
        fields = ['ground', 'ground_img']



class GroundSerializer(serializers.ModelSerializer):

    


    class Meta:
        model = Ground
        fields = ['name', 'location',]


class TeamSerializer(serializers.ModelSerializer):

    logo = serializers.ImageField()
    ground = GroundSerializer()
    

    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'coach', 'logo', 'ground',]



class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = ['name']




class PlayerSerializer(serializers.ModelSerializer):

    player_img = serializers.ImageField()
    position = PositionSerializer(many=True)
    team = TeamSerializer()

    class Meta:
        model = Player
        fields = ['id', 'name', 'dateOfBirth', 'dzongkhag', 'position', 'player_img', 'team']



class FixtureSerializer(serializers.ModelSerializer):
    home_team_name = serializers.CharField(source='homeTeam.name', read_only=True)
    home_team_logo = serializers.ImageField(source='homeTeam.logo', read_only=True)

    away_team_name = serializers.CharField(source='awayTeam.name', read_only=True)
    away_team_logo = serializers.ImageField(source='awayTeam.logo', read_only=True)

    formatted_date = serializers.SerializerMethodField()
    formatted_time = serializers.SerializerMethodField()
    

    class Meta:
        model = Fixture
        fields = ['season', 'home_team_name', 'home_team_logo', 'away_team_name', 'away_team_logo', 'formatted_date', 'formatted_time']





    def get_formatted_date(self, obj):
        return obj.dateTime.strftime("%A %d %B %Y")
    
    def get_formatted_time(self, obj):
        return obj.dateTime.strftime("%H:%M")




class GroupedFixtureSerializer(serializers.Serializer):
    date = serializers.DateField()
    fixtures = serializers.SerializerMethodField()

    class Meta:
        fields = ['date', 'fixtures']

    def get_fixtures(self, obj):
        fixtures = obj['fixtures']
        serializer = FixtureSerializer(fixtures, many=True, context=self.context)
        return serializer.data
    

    

class EventSerializer(serializers.ModelSerializer):
    
    player_name = serializers.CharField(source='player.name', read_only=True)
    player_team = serializers.CharField(source='player.team', read_only=True)

    substitute_player_name = serializers.CharField(source='substitute_player.name', read_only=True)


    class Meta:
        model = Event
        fields = ['playMatch', 'eventType', "event_minute",'extra_time', 'player_name','substitute_player_name', 'player_team', 'homeTeam']
    


class PlayMatchSerializer(serializers.ModelSerializer):

    home_team_name = serializers.CharField(source='fixture.homeTeam.name', read_only=True)
    home_team_logo = serializers.ImageField(source='fixture.homeTeam.logo', read_only=True)

    away_team_name = serializers.CharField(source='fixture.awayTeam.name', read_only=True)
    away_team_logo = serializers.ImageField(source='fixture.awayTeam.logo', read_only=True)

    date = serializers.DateTimeField(source = 'fixture.dateTime', read_only = True)

    playField = serializers.CharField(source='fixture.play_field.name', read_only = True)

    events = EventSerializer(many=True, read_only=True)
    class Meta:
        model = PlayMatch
        fields = ['id','home_team_name', 'events', 'home_team_logo','away_team_name','away_team_logo','status', 'homeScore', 'awayScore', 'date', "playField"]

class ResultSerializer(serializers.ModelSerializer):

    home_team_name = serializers.CharField(source='fixture.homeTeam.name', read_only=True)
    home_team_logo = serializers.ImageField(source='fixture.homeTeam.logo', read_only=True)

    away_team_name = serializers.CharField(source='fixture.awayTeam.name', read_only=True)
    away_team_logo = serializers.ImageField(source='fixture.awayTeam.logo', read_only=True)

    date = serializers.DateTimeField(source = 'fixture.dateTime', read_only = True)

    playField = serializers.CharField(source='fixture.play_field.name', read_only = True)

    
    class Meta:
        model = PlayMatch
        fields = ['id','home_team_name', 'home_team_logo','away_team_name','away_team_logo', 'homeScore', 'awayScore', 'date', "playField"]




# serializers.py
class LeagueTableSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source='team.name', read_only=True)
    team_logo = serializers.ImageField(source='team.logo', read_only=True)
    recent_form = serializers.SerializerMethodField()

    class Meta:
        model = LeagueTable
        fields = ['team_name', 'team_logo', 'matches_played', 'wins', 'draws', 'losses', 'goals_scored', 'goals_conceded', 'goal_difference', 'points', 'recent_form']

    def get_recent_form(self, obj):
        season = obj.season
        return obj.team.get_recent_form(season) 

class NewsSerializer(serializers.ModelSerializer):

    class Meta:
        model = News
        fields = ['id','category', 'title',  'published_date', 'image',]
class SponserSerializer(serializers.ModelSerializer):

    class Meta:
        model = Sponser
        fields = '__all__'

class FeaturedNewsSerializer(serializers.ModelSerializer):

    class Meta:
        model = News
        fields = ['id','category', 'title',  'published_date', 'image',]

class NewsDetailSerializer(serializers.ModelSerializer):

    class Meta:
        model = News
        fields = '__all__'