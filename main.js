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
        speed: Math.random() * 0.8 + 0.8,
        tail: cometPositions
    };
    
    comets.push(comet);
    scene.add(comet);
}

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