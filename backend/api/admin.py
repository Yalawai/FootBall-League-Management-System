from django.contrib import admin
from .models import Position, Player, Team, Ground, GroundImage, Fixture,Season,  PlayMatch, Event, LeagueTable, News, Sponser
from .forms import EventAdminForm, PlayMatchAdminForm

# Register your models here.
class GroundImageInline(admin.TabularInline):
    model = GroundImage
    extra = 1

class GroundAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'location',
    )

    inlines = [
        GroundImageInline
    ]

    search_fields = (
        'name', 'location',
    )

    list_filter = (
        'name',
    )


class TeamAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'coach',
    )


    search_fields = (
        'name', 'coach',
    )

    list_filter = (
        'name',
    )





class PlayerAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'dzongkhag'
    )

    search_fields = (
        'name', 'position',
    )
    list_filter = (
        'position',
    )


class PositionAdmin(admin.ModelAdmin):
    list_display = (
        'name',
    )
    search_fields = (
        'name',
    )



class SeasonAdmin(admin.ModelAdmin):
    list_display=(
        'name', 'startDate', 'endDate',
    )

    search_fields = (
        'name', 'startDate', 'endDate',
    )

    list_filter = (
        'name', 'startDate', 'endDate',
    )


class FixtureAdmin(admin.ModelAdmin):
    list_display = (
        'season', 'homeTeam', 'awayTeam', 'dateTime',
    )

    inlines = [
        
    ]

    search_fields = (
        'season', 'homeTeam', 'awayTeam', 'dateTime',
    )

    list_filter = (
        'season', 'homeTeam', 'awayTeam', 'dateTime',
    )

class PlayMatchAdmin(admin.ModelAdmin):

    form = PlayMatchAdminForm

    list_display = (
        'status', 'homeScore', 'awayScore', 'fixture', 'result',
    )
     
    search_fields = (
        'status', 'homeScore', 'awayScore', 'fixture',
    )

class EventAdmin(admin.ModelAdmin):
    form = EventAdminForm
    list_display = ('playMatch', 'player', 'eventType', 'display_event_time')

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == 'player' and 'playMatch' in request.GET:
            play_match_id = request.GET.get('playMatch')
            play_match = PlayMatch.objects.get(pk=play_match_id)
            fixture = play_match.fixture
            teams = [fixture.homeTeam, fixture.awayTeam]
            kwargs['queryset'] = Player.objects.filter(team__in=teams)
        elif db_field.name == 'substitute_player' and 'playMatch' in request.GET:
            play_match_id = request.GET.get('playMatch')
            play_match = PlayMatch.objects.get(pk=play_match_id)
            fixture = play_match.fixture
            teams = [fixture.homeTeam, fixture.awayTeam]
            kwargs['queryset'] = Player.objects.filter(team__in=teams)
        return super().formfield_for_foreignkey(db_field, request, **kwargs)






class LeagueTableAdmin(admin.ModelAdmin):
    list_display = ('team', 'season', 'matches_played', 'wins', 'draws', 'losses', 'goals_scored', 'goals_conceded', 'goal_difference', 'points')
    list_filter = ('season',)
    search_fields = ('team__name', 'season__name')


class NewsAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'published_date')
    search_fields = ('title', 'content')
    list_filter = ('category', 'published_date')
    fieldsets = (
        (None, {
            'fields': ('title', 'content', 'category', 'published_date')
        }),
        ('Media', {
            'fields': ('image', 'video_url', 'video_file')
        }),
    )

class SponserAdmin(admin.ModelAdmin):
    list_display = ('name',)





admin.site.register(Position, PositionAdmin)
admin.site.register(Player, PlayerAdmin)
admin.site.register(Team, TeamAdmin)
admin.site.register(Ground, GroundAdmin)
admin.site.register(GroundImage)
admin.site.register(Fixture, FixtureAdmin)
admin.site.register(PlayMatch, PlayMatchAdmin)
admin.site.register(Event, EventAdmin)
admin.site.register(Sponser, SponserAdmin)

admin.site.register(Season, SeasonAdmin)

admin.site.register(LeagueTable, LeagueTableAdmin)
admin.site.register(News, NewsAdmin)



