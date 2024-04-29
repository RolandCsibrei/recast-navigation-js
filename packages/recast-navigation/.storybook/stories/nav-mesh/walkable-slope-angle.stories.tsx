import { Bounds, OrbitControls } from '@react-three/drei';
import { NavMesh } from '@recast-navigation/core';
import { threeToSoloNavMesh } from '@recast-navigation/three';
import { useControls } from 'leva';
import React, { useEffect, useState } from 'react';
import { Group, Mesh } from 'three';
import { DEG2RAD } from 'three/src/math/MathUtils.js';
import { Debug } from '../../common/debug';
import { decorators } from '../../decorators';
import { parameters } from '../../parameters';

export default {
  title: 'NavMesh / Walkable Slope',
  decorators,
  parameters,
};

const DEGREES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45];

const ANGLES = DEGREES.map((angle, idx) => ({
  degrees: angle,
  rad: angle * DEG2RAD,
  position: [(-DEGREES.length * 5) / 2 + idx * 5, 0, 0] as const,
}));

export const WalkableSlope = () => {
  const [group, setGroup] = useState<Group | null>(null);

  const [navMesh, setNavMesh] = useState<NavMesh | undefined>();

  const { walkableSlopeAngle } = useControls('walkable-slope-angle', {
    walkableSlopeAngle: {
      value: 24,
      step: 1,
      min: 5,
      max: 50,
    },
  });

  useEffect(() => {
    if (!group) return;

    const meshes: Mesh[] = [];

    group.traverse((child) => {
      if (child instanceof Mesh) {
        meshes.push(child);
      }
    });

    const { navMesh } = threeToSoloNavMesh(meshes, {
      cs: 0.05,
      ch: 0.05,
      walkableSlopeAngle,
    });

    setNavMesh(navMesh);

    return () => {
      setNavMesh(undefined);
    };
  }, [group, walkableSlopeAngle]);

  return (
    <>
      <Bounds fit observe>
        <group ref={setGroup}>
          {ANGLES.map(({ degrees, rad, position }) => (
            <mesh key={degrees} rotation-x={rad} position={position}>
              <boxGeometry args={[3, 1, 5]} />
              <meshBasicMaterial color="#ccc" />
            </mesh>
          ))}
        </group>
      </Bounds>

      <Debug navMesh={navMesh} />

      <OrbitControls makeDefault />
    </>
  );
};
