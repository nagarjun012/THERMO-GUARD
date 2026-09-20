from fastapi import APIRouter
from app.data.demo_scenarios import DEMO_SCENARIOS
from app.models.schemas import DemoScenario
from pydantic import BaseModel

router = APIRouter()

class ScenarioActivate(BaseModel):
    scenario_id: str

ACTIVE_SCENARIO = "normal"

@router.get("/scenarios", response_model=list[DemoScenario])
async def get_scenarios():
    return [DemoScenario(**v) for v in DEMO_SCENARIOS.values()]

@router.post("/activate")
async def activate_scenario(req: ScenarioActivate):
    global ACTIVE_SCENARIO
    if req.scenario_id in DEMO_SCENARIOS:
        ACTIVE_SCENARIO = req.scenario_id
        return {"status": "success", "active": ACTIVE_SCENARIO}
    return {"status": "error", "message": "Invalid scenario"}

@router.get("/current", response_model=DemoScenario)
async def get_current_scenario():
    return DemoScenario(**DEMO_SCENARIOS[ACTIVE_SCENARIO])

@router.post("/reset")
async def reset_scenario():
    global ACTIVE_SCENARIO
    ACTIVE_SCENARIO = "normal"
    return {"status": "success", "active": ACTIVE_SCENARIO}
