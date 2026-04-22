import * as THREE from 'three';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
    antialias: true
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

// Create particles (stars)
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 3000;
const posArray = new Float32Array(particlesCount * 3);
const colorArray = new Float32Array(particlesCount * 3);
const opacityArray = new Float32Array(particlesCount);
const twinkleSpeedArray = new Float32Array(particlesCount);

for(let i = 0; i < particlesCount; i++) {
    posArray[i * 3] = (Math.random() - 0.5) * 300;
    posArray[i * 3 + 1] = (Math.random() - 0.5) * 300;
    posArray[i * 3 + 2] = (Math.random() - 0.5) * 300;
    colorArray[i * 3] = Math.random() * 0.5 + 0.5;
    colorArray[i * 3 + 1] = Math.random() * 0.5 + 0.5;
    colorArray[i * 3 + 2] = Math.random() * 0.5 + 0.5;
    opacityArray[i] = Math.random();
    twinkleSpeedArray[i] = Math.random() * 0.02 + 0.01;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
particlesGeometry.setAttribute('opacity', new THREE.BufferAttribute(opacityArray, 1));

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.3,
    vertexColors: true,
    transparent: true,
    opacity: 1,
    blending: THREE.AdditiveBlending
});

const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Create comets
const comets = [];
const cometCount = 8;

for(let i = 0; i < cometCount; i++) {
    const cometGeometry = new THREE.BufferGeometry();
    const cometMaterial = new THREE.PointsMaterial({
        size: 0.8,
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        blending: THREE.AdditiveBlending
    });

    const cometPositions = new Float32Array(30 * 3);
    const comet = new THREE.Points(cometGeometry, cometMaterial);
    
    // Random starting position
    comet.position.set(
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200,
        (Math.random() - 0.5) * 200
    );
    
    // Random direction
    comet.userData = {
        direction: new THREE.Vector3(
            Math.random() - 0.5,
            Math.random() - 0.5,
            Math.random() - 0.5
        ).normalize(),
        speed: Math.random() * 0.2 + 0.15,
        tail: cometPositions
    };
    
    comets.push(comet);
    scene.add(comet);
}

// === CELESTIAL BODIES ===


// Planet 1 — blue gas giant
const planet1Geometry = new THREE.SphereGeometry(3, 32, 32);
const planet1Material = new THREE.MeshStandardMaterial({
    color: 0x3366cc,
    roughness: 0.7,
    metalness: 0.2,
});
const planet1 = new THREE.Mesh(planet1Geometry, planet1Material);
planet1.position.set(70, -30, -90);
scene.add(planet1);

// Planet 1 ring
const ringGeometry = new THREE.RingGeometry(4.2, 6, 64);
const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x6699dd,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
});
const ring = new THREE.Mesh(ringGeometry, ringMaterial);
ring.position.copy(planet1.position);
ring.rotation.x = Math.PI * 0.4;
ring.rotation.y = Math.PI * 0.1;
scene.add(ring);

// Planet 2 — small reddish rocky planet
const planet2Geometry = new THREE.SphereGeometry(1.5, 24, 24);
const planet2Material = new THREE.MeshStandardMaterial({
    color: 0xcc6644,
    roughness: 0.9,
    metalness: 0.1,
});
const planet2 = new THREE.Mesh(planet2Geometry, planet2Material);
planet2.position.set(-40, -60, -70);
scene.add(planet2);

// Planet 3 — small pale green distant planet
const planet3Geometry = new THREE.SphereGeometry(2, 24, 24);
const planet3Material = new THREE.MeshStandardMaterial({
    color: 0x88bbaa,
    roughness: 0.8,
    metalness: 0.15,
});
const planet3 = new THREE.Mesh(planet3Geometry, planet3Material);
planet3.position.set(30, 70, -100);
scene.add(planet3);

// Nebula clouds — soft glowing blobs
function createNebula(x, y, z, color, size) {
    const nebulaGeometry = new THREE.SphereGeometry(size, 16, 16);
    const nebulaMaterial = new THREE.MeshBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.03,
        blending: THREE.AdditiveBlending
    });
    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    nebula.position.set(x, y, z);
    scene.add(nebula);
    return nebula;
}

const nebula1 = createNebula(50, 40, -80, 0x4466ff, 25);
const nebula2 = createNebula(-60, -20, -100, 0xff4488, 20);
const nebula3 = createNebula(-20, 60, -110, 0x44ffaa, 18);

// Point light to illuminate planets
const pointLight = new THREE.PointLight(0xffffff, 1.5, 300);
pointLight.position.set(-80, 50, -60);
scene.add(pointLight);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Mouse movement effect
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Animation with parallax effect
function animate() {
    requestAnimationFrame(animate);
    
    // Gentle rotation
    particlesMesh.rotation.y += 0.0001;

    // Celestial body animations
    const time = Date.now() * 0.001;

    // Planets slowly orbit in place (gentle wobble)
    planet1.rotation.y += 0.002;
    planet2.rotation.y += 0.003;
    planet3.rotation.y += 0.0015;
    ring.rotation.z += 0.001;

    
    // Increased parallax effect based on mouse position
    particlesMesh.position.x += (mouseX * 1.5 - particlesMesh.position.x) * 0.08;
    particlesMesh.position.y += (mouseY * 1.5 - particlesMesh.position.y) * 0.08;
    
    // Twinkling effect
    const opacityAttribute = particlesMesh.geometry.getAttribute('opacity');
    for(let i = 0; i < particlesCount; i++) {
        let opacity = opacityAttribute.array[i];
        opacity += twinkleSpeedArray[i];
        
        if(opacity > 1) {
            opacity = 1;
            twinkleSpeedArray[i] = -twinkleSpeedArray[i];
        } else if(opacity < 0.2) {
            opacity = 0.2;
            twinkleSpeedArray[i] = -twinkleSpeedArray[i];
        }
        
        opacityAttribute.array[i] = opacity;
    }
    opacityAttribute.needsUpdate = true;
    
    // Update comets
    comets.forEach(comet => {
        // Move comet
        comet.position.add(comet.userData.direction.clone().multiplyScalar(comet.userData.speed));
        
        // Create tail effect
        const tail = comet.userData.tail;
        for(let i = 0; i < 30; i++) {
            const t = i / 30;
            tail[i * 3] = comet.position.x - comet.userData.direction.x * t * 8;
            tail[i * 3 + 1] = comet.position.y - comet.userData.direction.y * t * 8;
            tail[i * 3 + 2] = comet.position.z - comet.userData.direction.z * t * 8;
        }
        comet.geometry.setAttribute('position', new THREE.BufferAttribute(tail, 3));
        
        // Reset comet if it goes too far
        if(Math.abs(comet.position.x) > 150 || Math.abs(comet.position.y) > 150 || Math.abs(comet.position.z) > 150) {
            comet.position.set(
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200,
                (Math.random() - 0.5) * 200
            );
            comet.userData.direction.set(
                Math.random() - 0.5,
                Math.random() - 0.5,
                Math.random() - 0.5
            ).normalize();
        }
    });
    
    renderer.render(scene, camera);
}

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();

 