# AyurTwin Bug Fixes & Run
## Steps:
1. [x] Add save_predictions to database/queries.py
2. [x] Fix ayurveda_engine.py: rename to get_ayurvedic_context
3. [x] Add run_ml_prediction to prediction_service.py
4. [x] Update fusion_engine.py to new sig with alerts (already perfect!)
5. [x] Implement recommendation_service.py
6. [ ] Fix sensor_router.py calls & error handling
7. [ ] Fix prediction_router.py import & logic
8. [ ] Update main.py to include all routers
9. [ ] Fix routers/__init__.py exports
10. [ ] pip install -r requirements.txt
11. [ ] uvicorn ayurtwin_backend.main:app --reload
12. [ ] Test endpoints
