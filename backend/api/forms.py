# yourapp/forms.py
from django import forms
from .models import Event, Player, PlayMatch,Fixture

class EventAdminForm(forms.ModelForm):
    class Meta:
        model = Event
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

        self.fields['playMatch'].queryset = PlayMatch.objects.filter(status='Ongoing')
        if self.instance and self.instance.playMatch_id:
            play_match = self.instance.playMatch
            fixture = play_match.fixture
            teams = [fixture.homeTeam, fixture.awayTeam]
            self.fields['player'].queryset = Player.objects.filter(team__in=teams)
            self.fields['substitute_player'].queryset = Player.objects.filter(team__in=teams)
        elif 'playMatch' in self.initial:
            play_match = PlayMatch.objects.get(pk=self.initial['playMatch'])
            fixture = play_match.fixture
            teams = [fixture.homeTeam, fixture.awayTeam]
            self.fields['player'].queryset = Player.objects.filter(team__in=teams)
            self.fields['substitute_player'].queryset = Player.objects.filter(team__in=teams)



class PlayMatchAdminForm(forms.ModelForm):
    class Meta:
        model = PlayMatch
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(PlayMatchAdminForm, self).__init__(*args, **kwargs)
        
        # Get the instance being edited, if any
        instance = kwargs.get('instance')
        
        # Get all fixture IDs that already have a PlayMatch
        existing_fixtures = PlayMatch.objects.values_list('fixture', flat=True)
        
        # Define the base queryset excluding existing fixtures
        base_queryset = Fixture.objects.exclude(id__in=existing_fixtures)
        
        if instance and instance.fixture:
            # If editing an existing instance, include its current fixture
            self.fields['fixture'].queryset = base_queryset | Fixture.objects.filter(id=instance.fixture.id)
        else:
            # If creating a new instance, just exclude existing fixtures
            self.fields['fixture'].queryset = base_queryset
