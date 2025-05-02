# consumers.py

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import PlayMatch, Event
from .serializers import EventSerializer, PlayMatchSerializer

class MatchConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = 'matches'
        self.room_group_name = f'match_{self.room_name}'
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        match_id = data['match_id']

        # Fetch the updated match and serialize it
        match = await database_sync_to_async(PlayMatch.objects.get)(id=match_id)
        serializer = PlayMatchSerializer(match)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'send_match_update',
                'message': serializer.data
            }
        )

    async def send_match_update(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'type': 'match_update',
            'message': message
        }))

    async def send_event_update(self, event):
        message = event['message']

        await self.send(text_data=json.dumps({
            'type': 'event_update',
            'message': message
        }))
