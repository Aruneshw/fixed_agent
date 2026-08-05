import json
import os
import asyncio
import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class RuleEngine:
    def __init__(self, rules_file: str = "rules.json"):
        self.rules_file = rules_file
        self.rules = []
        self.load_rules()

    def load_rules(self):
        if not os.path.exists(self.rules_file):
            self.rules = []
            return
        
        try:
            with open(self.rules_file, "r") as f:
                self.rules = json.load(f)
        except Exception as e:
            logger.error(f"Error loading rules: {e}")
            self.rules = []

    async def evaluate_event(self, event_type: str, details: Dict[str, Any], execute_action_cb):
        for rule in self.rules:
            if not rule.get("enabled", True):
                continue
            
            if rule.get("event") == event_type:
                conditions = rule.get("conditions", {})
                if self.check_conditions(conditions, details):
                    actions = rule.get("actions", [])
                    for action in actions:
                        await execute_action_cb(action, rule, details)

    def check_conditions(self, conditions: Dict[str, Any], details: Dict[str, Any]) -> bool:
        if not conditions:
            return True
            
        for key, expected_val in conditions.items():
            if key == "enabled":
                continue
            actual_val = details.get(key)
            # basic equality for now, can be expanded to logic like ">", "<", "contains"
            if actual_val != expected_val:
                return False
        return True
