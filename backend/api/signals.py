
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import PlayMatch, LeagueTable, Event, TeamForm
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .serializers import PlayMatchSerializer,  EventSerializer

@receiver(post_save, sender=PlayMatch)
def update_league_table(sender, instance, **kwargs):
    if instance.status == 'Completed':
        home_team_table, _ = LeagueTable.objects.get_or_create(team=instance.fixture.homeTeam, season=instance.fixture.season)
        away_team_table, _ = LeagueTable.objects.get_or_create(team=instance.fixture.awayTeam, season=instance.fixture.season)
        
        # Update stats for both home and away teams
        home_team_table.update_stats(instance)
        away_team_table.update_stats(instance)

@receiver(post_save, sender=PlayMatch)
def update_team_form(sender, instance, **kwargs):
    match = instance
    if match.status == 'Completed':
        if match.result == 'H':
            TeamForm.objects.create(team=match.fixture.homeTeam, match=match, form='W')
            TeamForm.objects.create(team=match.fixture.awayTeam, match=match, form='L')
        elif match.result == 'A':
            TeamForm.objects.create(team=match.fixture.homeTeam, match=match, form='L')
            TeamForm.objects.create(team=match.fixture.awayTeam, match=match, form='W')
        else:
            TeamForm.objects.create(team=match.fixture.homeTeam, match=match, form='D')
            TeamForm.objects.create(team=match.fixture.awayTeam, match=match, form='D')



@receiver(post_save, sender=PlayMatch)
def send_match_update(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    
    async_to_sync(channel_layer.group_send)(
        f'match_matches',
        {
            'type': 'send_match_update',
            'message': {
                'id': instance.id,
                'homeScore': instance.homeScore,
                'awayScore': instance.awayScore
            }
        }
    )

@receiver(post_save, sender=Event)
def send_event_update(sender, instance, **kwargs):
    channel_layer = get_channel_layer()
    serializer = EventSerializer(instance)
    async_to_sync(channel_layer.group_send)(
        f'match_matches',
        {
            'type': 'send_event_update',
            'message': serializer.data
        }
    )
