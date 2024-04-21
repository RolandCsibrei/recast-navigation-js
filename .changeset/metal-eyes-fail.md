---
"@recast-navigation/core": minor
"@recast-navigation/wasm": minor
"recast-navigation": minor
---

feat(NavMeshQuery): replace getClosestPoint with improved findClosestPoint

Renamed `getClosestPoint` to `findClosestPoint` to align naming with other methods.

`findClosestPoint` now returns a `success` and `status` property Previously if the operation was unsuccessful, a zero vector was returned. Now, the `success` property will be `false` and the `status` property will contain a dtStatus describing the reason for failure.