import React, { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraViewMode, sceneStateMachine } from '../core/SceneStateMachine';
import { getCameraPoseForViewport } from './CameraDirector';

interface CameraRigProps {
  viewMode: CameraViewMode;
  reducedMotion: boolean;
}

export const CameraRig: React.FC<CameraRigProps> = ({ viewMode, reducedMotion }) => {
  const { camera, size } = useThree();
  const aspect = size.width / Math.max(1, size.height);

  const initialPose = getCameraPoseForViewport(viewMode, aspect);
  const currentPos = useRef(new THREE.Vector3(...initialPose.position));
  const currentTarget = useRef(new THREE.Vector3(...initialPose.target));
  const desiredPos = useRef(new THREE.Vector3(...initialPose.position));
  const desiredTarget = useRef(new THREE.Vector3(...initialPose.target));

  useEffect(() => {
    const pose = getCameraPoseForViewport(viewMode, aspect);
    if (reducedMotion) {
      currentPos.current.set(...pose.position);
      currentTarget.current.set(...pose.target);
      camera.position.copy(currentPos.current);
      camera.lookAt(currentTarget.current);
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = pose.fov;
        camera.updateProjectionMatrix();
      }
      sceneStateMachine.completeTransition();
    }
  }, [viewMode, aspect, reducedMotion, camera]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const pose = getCameraPoseForViewport(viewMode, aspect);

    // Subtle, non-distracting pointer parallax when not in reduced-motion mode
    const parallaxStrength = reducedMotion ? 0 : viewMode === 'wide' ? 0.045 : 0.018;
    const px = state.pointer.x * parallaxStrength;
    const py = state.pointer.y * parallaxStrength * 0.65;

    desiredPos.current.set(
      pose.position[0] + px,
      pose.position[1] + py,
      pose.position[2]
    );
    desiredTarget.current.set(
      pose.target[0] + px * 0.25,
      pose.target[1] + py * 0.25,
      pose.target[2]
    );

    const dampLambda = reducedMotion ? 40 : 4.2;

    currentPos.current.x = THREE.MathUtils.damp(
      currentPos.current.x,
      desiredPos.current.x,
      dampLambda,
      dt
    );
    currentPos.current.y = THREE.MathUtils.damp(
      currentPos.current.y,
      desiredPos.current.y,
      dampLambda,
      dt
    );
    currentPos.current.z = THREE.MathUtils.damp(
      currentPos.current.z,
      desiredPos.current.z,
      dampLambda,
      dt
    );

    currentTarget.current.x = THREE.MathUtils.damp(
      currentTarget.current.x,
      desiredTarget.current.x,
      dampLambda,
      dt
    );
    currentTarget.current.y = THREE.MathUtils.damp(
      currentTarget.current.y,
      desiredTarget.current.y,
      dampLambda,
      dt
    );
    currentTarget.current.z = THREE.MathUtils.damp(
      currentTarget.current.z,
      desiredTarget.current.z,
      dampLambda,
      dt
    );

    camera.position.copy(currentPos.current);
    camera.lookAt(currentTarget.current);

    if (camera instanceof THREE.PerspectiveCamera) {
      const nextFov = THREE.MathUtils.damp(camera.fov, pose.fov, dampLambda, dt);
      if (Math.abs(nextFov - camera.fov) > 0.01) {
        camera.fov = nextFov;
        camera.updateProjectionMatrix();
      }
    }

    if (currentPos.current.distanceToSquared(desiredPos.current) < 0.0004) {
      sceneStateMachine.completeTransition();
    }
  });

  return null;
};
