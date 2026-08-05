import asyncio
import socket
from typing import Callable
import psutil

class NetworkWatcher:
    def __init__(self, event_bus_callback: Callable, interval: int = 10):
        self.event_bus_callback = event_bus_callback
        self.interval = interval
        self.running = False
        self.last_status = True

    async def start(self):
        self.running = True
        while self.running:
            is_connected = self.check_connection()
            if is_connected and not self.last_status:
                await self.event_bus_callback("INTERNET_CONNECTED", "NetworkWatcher", {})
            elif not is_connected and self.last_status:
                await self.event_bus_callback("INTERNET_DISCONNECTED", "NetworkWatcher", {})
            
            self.last_status = is_connected
            await asyncio.sleep(self.interval)

    def stop(self):
        self.running = False

    def check_connection(self):
        try:
            socket.create_connection(("1.1.1.1", 53), timeout=2)
            return True
        except OSError:
            pass
        return False
