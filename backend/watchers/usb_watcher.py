import asyncio
import psutil
from typing import Callable

class USBWatcher:
    def __init__(self, event_bus_callback: Callable, interval: int = 5):
        self.event_bus_callback = event_bus_callback
        self.interval = interval
        self.running = False
        self.known_devices = set()

    async def start(self):
        self.running = True
        self.known_devices = self.get_removable_drives()
        
        while self.running:
            current_devices = self.get_removable_drives()
            new_devices = current_devices - self.known_devices
            removed_devices = self.known_devices - current_devices

            for dev in new_devices:
                await self.event_bus_callback("USB_INSERTED", "USBWatcher", {"device": dev})
            
            for dev in removed_devices:
                await self.event_bus_callback("USB_REMOVED", "USBWatcher", {"device": dev})
                
            self.known_devices = current_devices
            await asyncio.sleep(self.interval)

    def stop(self):
        self.running = False

    def get_removable_drives(self):
        partitions = psutil.disk_partitions(all=False)
        # On Windows, 'removable' is an option. On Linux, we check if it mounts in /media or /run/media.
        removable = set()
        for p in partitions:
            if 'removable' in p.opts or p.mountpoint.startswith('/media') or p.mountpoint.startswith('/run/media'):
                removable.add(p.device)
        return removable
