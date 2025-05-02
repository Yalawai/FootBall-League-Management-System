from django.db.models import Q
from rest_framework import generics
from .models import Player, Team, Fixture, PlayMatch, LeagueTable, Season, News, Sponser
from .serializers import PlayerSerializer, TeamSerializer, ResultSerializer, PlayMatchSerializer, LeagueTableSerializer, GroupedFixtureSerializer, FeaturedNewsSerializer, SponserSerializer, NewsSerializer, SeasonSerializer, NewsDetailSerializer
from rest_framework.response import Response
from django.utils import timezone
from rest_framework.pagination import PageNumberPagination




class PlayerList(generics.ListAPIView):
    queryset = Player.objects.all()
    serializer_class = PlayerSerializer


class TeamViewSet(generics.ListAPIView):
    queryset = Team.objects.all()
    serializer_class = TeamSerializer


class FixturePagination(PageNumberPagination):
    page_size = 10  # Number of items per page
    page_size_query_param = 'page_size'  # Optional - allows clients to override page size
    max_page_size = 100

class FixtureViewSet(generics.ListAPIView):
    pagination_class = FixturePagination  # Apply the custom pagination class

    def get_queryset(self):
        now = timezone.now()
        season_param = self.request.query_params.get('season', None)
        
        if season_param:
            season = Season.objects.filter(id=season_param).first()
            if not season:
                return Fixture.objects.none()
        else:
            season = Season.objects.latest('startDate')

        return Fixture.objects.filter(season=season, dateTime__gt = now).order_by('dateTime')[:10]

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)

        if page is not None:
            grouped_fixtures = self.group_fixtures_by_date(page)
            serializer = GroupedFixtureSerializer(grouped_fixtures, many=True, context={'request': request})
            return self.get_paginated_response(serializer.data)

        grouped_fixtures = self.group_fixtures_by_date(queryset)
        serializer = GroupedFixtureSerializer(grouped_fixtures, many=True, context={'request': request})
        return Response(serializer.data)

    def group_fixtures_by_date(self, queryset):
        grouped_fixtures = {}
        for fixture in queryset:
            date_str = fixture.dateTime.strftime("%A %d %B %Y")
            if date_str not in grouped_fixtures:
                grouped_fixtures[date_str] = []
            grouped_fixtures[date_str].append(fixture)
        return [
            {'date': date, 'fixtures': fixtures} for date, fixtures in grouped_fixtures.items()
        ]
    

    
    





class PlayMatchViewSet(generics.ListAPIView):
    queryset = PlayMatch.objects.filter(status = 'Ongoing' )
    serializer_class = PlayMatchSerializer

    



class LeagueTableViewSet(generics.ListAPIView):
    serializer_class = LeagueTableSerializer

    def get_queryset(self):
        season_param = self.request.query_params.get('season', None)
        
        if season_param:
            season = Season.objects.filter(id=season_param).first()
            if not season:
                return LeagueTable.objects.none()
        else:
            season = Season.objects.latest('startDate')

        return LeagueTable.objects.filter(season=season).order_by('-points', '-goal_difference', '-goals_scored')

class FeaturedNewsViewSet(generics.ListAPIView):
    queryset =  News.objects.all().order_by('-published_date')[:11]
    serializer_class = FeaturedNewsSerializer

class NewsPagination(PageNumberPagination):
    page_size = 10 # Number of items per page



class NewsViewSet(generics.ListAPIView):
    queryset = News.objects.all()
    serializer_class = NewsSerializer
    pagination_class = NewsPagination

class SponserViewSet(generics.ListAPIView):
    queryset = Sponser.objects.all()
    serializer_class = SponserSerializer


class SeasonViewSet(generics.ListAPIView):
    queryset = Season.objects.all().order_by('-startDate')
    serializer_class = SeasonSerializer

class NewsDetailView(generics.RetrieveAPIView):
    queryset = News.objects.all()
    serializer_class = NewsDetailSerializer

class ResultPagination(PageNumberPagination):
    page_size = 15
    
   


class ResultsView(generics.ListAPIView):

    serializer_class = ResultSerializer
    pagination_class = ResultPagination

    def get_queryset(self):
        query_params = self.request.query_params
        season_param = query_params.get('season', None)
        team_param = query_params.get('team', None)

        queryset = PlayMatch.objects.filter(status='Completed')

        if season_param:
            season = Season.objects.filter(id=season_param).first()
            if season:
                queryset = queryset.filter(fixture__season=season)
        else:
            season = Season.objects.latest('startDate')
            queryset = queryset.filter(fixture__season=season)

        if team_param:
            queryset = queryset.filter(Q(fixture__homeTeam_id=team_param) | Q(fixture__awayTeam_id=team_param))


        

        return queryset


class ResultDetailView(generics.RetrieveAPIView):
    queryset = PlayMatch.objects.all()
    serializer_class = PlayMatchSerializer

    
