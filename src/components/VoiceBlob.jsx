import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const Blob = ({ volume = 0, isActive }) => {
    const mesh = useRef();
    const material = useRef();

    // Base configuration
    const baseColor = new THREE.Color("#D4AF37"); // Deep Nubian Gold
    const activeColor = new THREE.Color("#FFD700"); // Bright Gold
    const neonColor = new THREE.Color("#00E5FF"); // Nile Neon

    useFrame((state, delta) => {
        if (!material.current || !mesh.current) return;

        // Calculate targets based on state and volume
        const targetDistort = isActive ? 0.4 + (volume * 0.6) : 0.3;
        const targetSpeed = isActive ? 2 + (volume * 8) : 0.8;
        const targetScale = isActive ? 1.8 + (volume * 0.4) : 1.5;

        // Smoothly interpolate current values to targets
        material.current.distort = THREE.MathUtils.lerp(material.current.distort, targetDistort, delta * 3);
        material.current.speed = THREE.MathUtils.lerp(material.current.speed, targetSpeed, delta * 3);

        // Scale pulse
        const currentScale = mesh.current.scale.x;
        const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 8);
        mesh.current.scale.set(newScale, newScale, newScale);

        // Color shifting based on volume intensity
        if (isActive && volume > 0.1) {
            // Mix gold with neon teal on high volume
            material.current.color.lerpColors(activeColor, neonColor, volume * 0.5);
        } else {
            material.current.color.lerp(baseColor, delta * 2);
        }
    });

    return (
        <Sphere ref={mesh} args={[1, 100, 100]}>
            <MeshDistortMaterial
                ref={material}
                color={baseColor}
                attach="material"
                distort={0.3}
                speed={1.5}
                roughness={0.1}
                metalness={0.9} // Glassy metallic look
                clearcoat={1}
                clearcoatRoughness={0.1}
                bumpScale={0.005}
            />
        </Sphere>
    );
};

const VoiceBlob = ({ volume = 0, isActive = false }) => {
    return (
        <div style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}> {/* dpr for crisp mobile rendering */}
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
                <pointLight position={[-10, -5, -5]} intensity={2} color="#00E5FF" distance={20} />
                <pointLight position={[5, 5, 5]} intensity={1} color="#FFD700" />

                <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                    <Blob volume={volume} isActive={isActive} />
                </Float>
            </Canvas>
        </div>
    );
};

export default VoiceBlob;
