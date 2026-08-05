import psutil
import time
import asyncio
from typing import Callable

class SystemWatcher:
    def __init__(self, event_bus_callback: Callable, interval: int = 5):
        self.event_bus_callback = event_bus_callback
        self.interval = interval
        self.running = False
        self.known_processes = set()
    
    async def start(self):
        self.running = True
        self.known_processes = set(psutil.pids())
        
        while self.running:
            await self.check_health()
            await self.check_processes()
            await asyncio.sleep(self.interval)

    def stop(self):
        self.running = False

    async def check_health(self):
        cpu = psutil.cpu_percent(interval=None)
        mem = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        if cpu > 90:
            await self.event_bus_callback("HIGH_CPU_USAGE", "SystemWatcher", {"cpu_percent": cpu})
        if mem.percent > 90:
            await self.event_bus_callback("HIGH_RAM_USAGE", "SystemWatcher", {"ram_percent": mem.percent})
        if disk.percent > 95:
            await self.event_bus_callback("HIGH_DISK_USAGE", "SystemWatcher", {"disk_percent": disk.percent})

    async def check_processes(self):
        current_pids = set(psutil.pids())
        new_pids = current_pids - self.known_processes
        dead_pids = self.known_processes - current_pids
        
        for pid in new_pids:
            try:
                proc = psutil.Process(pid)
                await self.event_bus_callback("PROCESS_STARTED", "SystemWatcher", {
                    "pid": pid,
                    "name": proc.name(),
                    "exe": proc.exe() if hasattr(proc, 'exe') else None
                })
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                pass

        for pid in dead_pids:
            await self.event_bus_callback("PROCESS_EXITED", "SystemWatcher", {"pid": pid})

        self.known_processes = current_pids
