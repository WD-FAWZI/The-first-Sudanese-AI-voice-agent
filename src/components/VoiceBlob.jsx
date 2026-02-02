import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Sphere, Float, MeshTransmissionMaterial, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

const InnerMagicSphere = ({ texture }) => {
    texture.wrapS = THREE.MirroredRepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.repeat.set(1, 1);
    texture.anisotropy = 16;

    return (
        <mesh scale={[0.99, 0.99, 0.99]}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshBasicMaterial 
                map={texture} 
                toneMapped={false} 
                side={THREE.DoubleSide}
            />
        </mesh>
    );
};

const PulsingLights = ({ volume, isActive }) => {
    const lightRef = useRef();
    const backLightRef = useRef();

    useFrame((state, delta) => {
        const targetIntensity = isActive ? 2 + (volume * 3) : 1.5;
        if (lightRef.current) {
            lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, targetIntensity, delta * 5);
        }

        if (backLightRef.current) {
            backLightRef.current.position.x = Math.sin(state.clock.elapsedTime) * 3;
        }
    });

    return (
        <group>
            <pointLight ref={lightRef} position={[10, 10, 10]} color="#ffbd2e" distance={20} decay={2} />
            <pointLight ref={backLightRef} position={[-5, -5, -10]} intensity={2} color="#0044ff" distance={20} />
            <ambientLight intensity={0.5} />
        </group>
    );
};

const Blob = ({ volume = 0, isActive }) => {
    const groupRef = useRef();
    const texture = useLoader(THREE.TextureLoader, '/nile.png');

    const config = {
        backside: false,
        samples: 8,
        resolution: 512,
        transmission: 1, 
        roughness: 0,
        thickness: 0.1,
        ior: 1.15, 
        chromaticAberration: 0.04,
        anisotropy: 0.1,
        distortion: 0.0,
        distortionScale: 0.0,
        temporalDistortion: 0.0,
        color: '#fff9e6',
        attenuationDistance: 0.5,
        attenuationColor: '#ffd700',
    };

    useFrame((state, delta) => {
        if (!groupRef.current) return;
        
        const targetScale = isActive ? 1.25 + (volume * 0.15) : 1.15;
        const currentScale = groupRef.current.scale.x;
        const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 5);
        groupRef.current.scale.set(newScale, newScale, newScale);

        groupRef.current.rotation.y += delta * 0.1;
    });

    return (
        <group ref={groupRef}>
            <Sphere args={[1, 64, 64]}>
                <MeshTransmissionMaterial {...config} />
            </Sphere>
            <InnerMagicSphere texture={texture} />
        </group>
    );
};

const VoiceBlob = ({ volume = 0, isActive = false }) => {
    return (
        <div style={{ width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none' }}>
            <Canvas 
                camera={{ position: [0, 0, 4.5], fov: 40 }} 
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
            >
                <PulsingLights volume={volume} isActive={isActive} />
                
                <Suspense fallback={null}>
                    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
                        <Blob volume={volume} isActive={isActive} />
                    </Float>
                </Suspense>

                <ContactShadows 
                    position={[0, -1.5, 0]} 
                    opacity={0.6} 
                    scale={10} 
                    blur={3} 
                    far={1.5} 
                    color="#d4af37" 
                />
            </Canvas>
        </div>
    );
};

export default VoiceBlob;