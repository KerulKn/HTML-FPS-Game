let scene, camera, renderer;
let floorGeometry, floorMaterial, floorMesh;
let controlsEnabled = false;
let prevMouseX = 0;
let cubeMesh;
let playerHealth = 100; // Player's initial health
let isGameFrozen = false;
let movementSpeed = 0.2; // Initial movement speed
const dashSpeed = 0.2; // Speed during dash action
let bulletCount = 0; 
let dashMeter = 100;
let soundFile;
let enemySpeed = 0.1;
let enemySpeedCooldown = false;
let bullets = [];
let enemies = [];
let squareMesh;
const recoilDistance = -0.1; // Distance to move the gun back
const recoilDuration = 0.05; // Duration of the recoil effect in seconds
let reload = 20;
const sceneSound = new Audio('night.mp3');



// Flag to track if the gun is currently recoiling
let isRecoiling = false;

function init() {
  scene = new THREE.Scene();

  // Set the background color of the scene to grey
  const Color = new THREE.Color(0.01, 0.01, 0.01); // RGB values range from 0 to 1
  scene.background = Color;

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );


  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true; // Enable shadows
  document.body.appendChild(renderer.domElement);

  // Add lights to the scene
  addLights();
  addFog('black', 10, 30);

setTimeout(function() {
  spawnEnemies(1);
}, 5000);



  floorGeometry = new THREE.PlaneGeometry(80, 80);
  floorMaterial = new THREE.MeshPhongMaterial({ color: new THREE.Color(0.2, 0.2, 0.2) });
  floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, -1, 0); // Set the floor position
  floorMesh.receiveShadow = true; // Enable shadow receiving
  scene.add(floorMesh);


  // Position the camera
  camera.position.set(0, 1, 0);

  // Add event listeners for player controls
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  document.addEventListener('click', onClick);

  // Enable pointer lock API
  document.addEventListener('pointerlockchange', onPointerLockChange);
  document.addEventListener('mozpointerlockchange', onPointerLockChange);

  const models = [];

  const floorWidth = 80; // Width of the floorGeometry
  const floorHeight = 80; // Height of the floorGeometry
  const space = 10; // Space between trees
  
  for (let i = 0; i < 30; i++) {
    const tree = {
      mtlPath: 'Lowpoly_tree_sample.mtl',
      objPath: 'Lowpoly_tree_sample.obj',
      position: new THREE.Vector3(
        Math.random() * (floorWidth - space) - floorWidth / 2 + space / 2,
        -1,
        Math.random() * (floorHeight - space) - floorHeight / 2 + space / 2
      ),
      rotation: new THREE.Euler(0, Math.random() * Math.PI * 2, 0), // Random rotation around the y-axis
      scale: new THREE.Vector3(0.3, 0.3, 0.3),
    };
  
    models.push(tree);
  }
for (let i = 0; i < 12; i++) {
  const tree = {
    mtlPath: 'Lowpoly_tree_sample.mtl',
    objPath: 'BrickWall.obj',
    position: new THREE.Vector3(-40.5, -1, -40 + i * 7), // Update the z-axis position
    rotation: new THREE.Euler(0, 0, 0), // Random rotation around the y-axis
    scale: new THREE.Vector3(1.5, 1.5, 2),
  };

  models.push(tree);
}
for (let i = 0; i < 12; i++) {
  const tree = {
    mtlPath: 'Lowpoly_tree_sample.mtl',
    objPath: 'BrickWall.obj',
    position: new THREE.Vector3(40.5, -1, -40 + i * 7), // Update the z-axis position
    rotation: new THREE.Euler(0, 0, 0), // Random rotation around the y-axis
    scale: new THREE.Vector3(1.5, 1.5, 2),
  };

  models.push(tree);
}
for (let i = 0; i < 12; i++) {
  const tree = {
    mtlPath: 'Lowpoly_tree_sample.mtl',
    objPath: 'BrickWall.obj',
    position: new THREE.Vector3(-40+ i * 7, -1, -40.5 ), // Update the z-axis position
    rotation: new THREE.Euler(0, Math.PI/2, 0), // Random rotation around the y-axis
    scale: new THREE.Vector3(1.5, 1.5, 2),
  };

  models.push(tree);
}
for (let i = 0; i < 12; i++) {
  const tree = {
    mtlPath: 'Lowpoly_tree_sample.mtl',
    objPath: 'BrickWall.obj',
    position: new THREE.Vector3(-40+ i * 7, -1, 40.5 ), // Update the z-axis position
    rotation: new THREE.Euler(0, Math.PI/2, 0), // Random rotation around the y-axis
    scale: new THREE.Vector3(1.5, 1.5, 2),
  };

  models.push(tree);
}
  
  
  
  models.push({
    mtlPath: '',
    objPath: 'Bir.obj',
    position: new THREE.Vector3(2, -1, -5),
    rotation: new THREE.Euler(0, Math.PI, 0),
    scale: new THREE.Vector3(1, 1, 1),
  });
  
  // Add the gun model
  models.push({
    mtlPath: 'AssaultRifle2_4.mtl',
    objPath: 'AssaultRifle2_4.obj',
    position: new THREE.Vector3(0, 0, 0),
    rotation: new THREE.Euler(0, 0, 0),
    scale: new THREE.Vector3(0.4, 0.4, 0.42),
    isGun: true,
    
  });
  
  

  addOBJModels(models);
  // Add health bar to the HTML body
  if(playerHealth >50){
  const ProfilePic = document.createElement('div');
  ProfilePic.id = 'profile';
  ProfilePic.style.position = 'absolute';
  ProfilePic.style.bottom = '20px';
  ProfilePic.style.left = '20px';
  ProfilePic.style.width = '100px';
  ProfilePic.style.height = '100px';
  ProfilePic.style.backgroundColor = 'grey';
  ProfilePic.style.borderRadius = '50%'; // Make the profile picture circular
  ProfilePic.style.backgroundImage = "url('Happy.png')"; // Replace 'path/to/your/image.png' with the actual path to your PNG image
  ProfilePic.style.backgroundSize = 'cover';
  ProfilePic.style.border = '4px solid grey'; // Add border style
  document.body.appendChild(ProfilePic);
  }
  


  const healthBar = document.createElement('div');
  healthBar.id = 'health-bar';
  healthBar.style.position = 'absolute';
  healthBar.style.bottom = '20px';
  healthBar.style.left = '130px';
  healthBar.style.width = '200px';
  healthBar.style.height = '20px';
  healthBar.style.backgroundColor = 'gray';

  const healthBarValue = document.createElement('div');
  healthBarValue.id = 'health-bar-value';
  healthBarValue.style.width = '100%';
  healthBarValue.style.height = '100%';
  healthBarValue.style.backgroundColor = 'green';
  healthBar.appendChild(healthBarValue);

  document.body.appendChild(healthBar);

  // Create the shoot cursor element
  const shootCursorElement = document.createElement('div');
  shootCursorElement.classList.add('shoot-cursor');

  // Position the shoot cursor in the center of the screen
  shootCursorElement.style.position = 'fixed';
  shootCursorElement.style.top = '50%';
  shootCursorElement.style.left = '50%';
  shootCursorElement.style.transform = 'translate(-50%, -50%)';
  shootCursorElement.style.width = '5px';
  shootCursorElement.style.height = '5px';
  shootCursorElement.style.backgroundColor = 'white';
  shootCursorElement.style.borderRadius = '50%';
  shootCursorElement.style.pointerEvents = 'none'; // Prevent cursor from interfering with mouse events

  // Append the shoot cursor element to the body
  document.body.appendChild(shootCursorElement);

  // Create the timer element
  const timerElement = document.createElement("div");
  timerElement.id = "timer";
  timerElement.textContent = "0";
  timerElement.style.position = "absolute";
  timerElement.style.top = "10px";
  timerElement.style.left = "50%";
  timerElement.style.transform = "translateX(-50%)";
  timerElement.style.fontSize = "24px";
  timerElement.style.color = "#fff";

  // Create the score element
  const scoreElement = document.createElement("div");
  scoreElement.id = "score";
  scoreElement.textContent = "SCORE: 0";
  scoreElement.style.position = "absolute";
  scoreElement.style.top = "10px";
  scoreElement.style.right = "10px";
  scoreElement.style.fontSize = "24px";
  scoreElement.style.color = "#fff";

  // Append the timer and score elements to the body
  document.body.appendChild(timerElement);
  document.body.appendChild(scoreElement);

    
}
const dashMeterElement = document.createElement('div');
dashMeterElement.style.position = 'absolute';
dashMeterElement.style.bottom = '50px';
dashMeterElement.style.left = '130px';
dashMeterElement.style.width = '200px';
dashMeterElement.style.height = '10px';
dashMeterElement.style.backgroundColor = '#ddd';

const dashMeterFillElement = document.createElement('div');
dashMeterFillElement.style.height = '100%';
dashMeterFillElement.style.backgroundColor = 'orange';
dashMeterElement.appendChild(dashMeterFillElement);

document.body.appendChild(dashMeterElement);

function updateDashMeter() {
  const dashMeterFillWidth = `${dashMeter}%`;
  dashMeterFillElement.style.width = dashMeterFillWidth;
}
function displayGameOver() {
  if (playerHealth > 50) {
    const newPlayerImagePath = 'depositphotos_502598110-stock-photo-night-360-panorama-stars-milky.jpg'; // Specify the path to the new player image
    
    // Change the player image
    playerImage.src = newPlayerImagePath;
    
  }
  
  // Check if the health has reached 0
  if (playerHealth > 0) {
    return; // Exit the function if health is not 0
  }

  // Create the overlay element
  const overlay = document.createElement('div');
  overlay.id = 'game-over-overlay';

  // Set the background color and opacity
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';

  // Create the transparent overlay to prevent interaction with the game elements
  const transparentOverlay = document.createElement('div');
  transparentOverlay.style.position = 'absolute';
  transparentOverlay.style.top = '0';
  transparentOverlay.style.left = '0';
  transparentOverlay.style.width = '100%';
  transparentOverlay.style.height = '100%';
  transparentOverlay.style.pointerEvents = 'none'; // Make the transparent overlay element transparent to pointer events

  // Create the game over text element
  const gameOverText = document.createElement('h1');
  gameOverText.innerText = 'GAME OVER';
  gameOverText.style.color = 'white';

  // Create a container for the game over text and restart button
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.style.flexDirection = 'column';
  container.style.alignItems = 'center';
  container.style.gap = '20px';

  // Create the restart button
  const restartButton = document.createElement('button');
  restartButton.innerText = 'Play Again';
  restartButton.style.opacity = '1';

  // Add event listener for the restart button
  restartButton.addEventListener('click', function () {
    // Reload the page to start the game again
    location.reload();
  });

  // Add the game over text and restart button to the container
  container.appendChild(gameOverText);
  container.appendChild(restartButton);

  // Add the transparent overlay to the overlay
  overlay.appendChild(transparentOverlay);

  // Add the container to the overlay
  overlay.appendChild(container);

  // Add the overlay to the document body
  document.body.appendChild(overlay);
}



// Update player's health display
function updateHealthDisplay() {
  const healthBarValue = document.getElementById('health-bar-value');
  healthBarValue.style.width = `${playerHealth}%`;
}

function handlePlayerHit() {
  playerHealth -= 1; // Decrease player's health by 1
  console.log('Player health:', playerHealth); // Check player's health
  updateHealthDisplay();

  if (playerHealth <= 0) {
    displayGameOver();
    freezeGame();
  
  }
}



// Function to handle bullet hits on enemies
function handleEnemyHit(enemy) {
  const enemyIndex = enemies.indexOf(enemy);
  if (enemyIndex !== -1) {
    // Remove the enemy from the scene
    scene.remove(enemy);
    enemies.splice(enemyIndex, 1);
  }
}

// Function to check if the bullet hits the target
function isBulletHittingTarget(bullet) {
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const distance = bullet.position.distanceTo(enemy.position);
    if (distance < 0.5) { // Adjust the value as needed for collision detection
      
      return true;
    }
  }
  return false;
}

function spawnEnemies(level) {

  let numEnemies;
  let objFile;
  let mtlFile;

  const objLoader = new THREE.OBJLoader();
  const mtlLoader = new THREE.MTLLoader();

  if (level === 1) {
    numEnemies = 12;
    objFile = 'Demon.obj';
    mtlFile = 'Demon.mtl';

  } else if (level === 2) {
    numEnemies = 13;
    objFile = 'Alpaking.obj';
    mtlFile = 'Alpaking.mtl';

  } else if (level === 3) {
    numEnemies = 14;
    objFile = 'Alpaking_Evolved.obj';
    mtlFile = 'Alpaking_Evolved.mtl';
    } else {
    // Handle invalid level numbers or add more level configurations
    console.error('Invalid level number.');
    return;
  }

  mtlLoader.load(mtlFile, function (materials) {
    materials.preload();
    objLoader.setMaterials(materials);
    objLoader.load(objFile, function (object) {
      object.traverse(function (child) {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
        }
      });

      for (let i = 0; i < numEnemies; i++) {
        // Clone the loaded enemy model
        const enemy = object.clone();

        // Set enemy's position, rotation, scale, and other properties as needed
        const randomX = Math.random() * 80 - 40; // Random X coordinate between -10 and 10
        const randomZ = Math.random() * 80 - 40; // Random Z coordinate between -10 and 10
        enemy.position.set(randomX, 0.5, randomZ);
        enemy.rotation.x = Math.PI / 2; // Set rotation around the x-axis (90 degrees in radians)
        enemy.scale.set(1, 1, 1);

        // Add the enemy to the scene and enemies array
        scene.add(enemy);
        enemies.push(enemy);
      }
    });
  });

}




function moveEnemies() {
  const minDistance = 2; // Minimum distance to maintain between enemies
  const moveDistance = 20; 

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];

    // Calculate the direction vector towards the player (camera)
    const directionToPlayer = camera.position.clone().sub(enemy.position).normalize();

    // Calculate the rotation angle around the Y-axis to face the player (camera)
    const angleToPlayer = Math.atan2(directionToPlayer.x, directionToPlayer.z);

    // Rotate the enemy around the Y-axis to face the player (camera)
    enemy.rotation.y = angleToPlayer;

    // Reset the rotation around the X-axis and Z-axis to ensure upright orientation
    enemy.rotation.x = 0;
    enemy.rotation.z = 0;

    // Check if the enemy is within the move distance threshold
    if (enemy.position.distanceTo(camera.position) <= moveDistance) {
      // Move the enemy towards the player (camera)
      enemy.position.add(directionToPlayer.multiplyScalar(enemySpeed));

      // Restrict the enemy from moving below y = 0.5
      enemy.position.y = Math.max(enemy.position.y, 0.5);

      // Check for collision with other enemies
      for (let j = 0; j < enemies.length; j++) {
        if (i !== j) {
          const otherEnemy = enemies[j];
          const distance = enemy.position.distanceTo(otherEnemy.position);

          if (distance < minDistance) {
            // Calculate the avoidance vector away from the other enemy
            const avoidance = enemy.position.clone().sub(otherEnemy.position).normalize();

            // Adjust the enemy's position to avoid collision
            enemy.position.add(avoidance.multiplyScalar(enemySpeed));
          }
        }
      }

      // Check for collision with the player
      const distanceToPlayer = enemy.position.distanceTo(camera.position);
      if (distanceToPlayer < 1) {
        handlePlayerHit();
      }
    }
  }
}

function addOBJModels(models) {
  const mtlLoader = new THREE.MTLLoader();

  models.forEach((model) => {
    mtlLoader.load(model.mtlPath, (materials) => {
      materials.preload();

      // Set the material shading type
      materials.shading = THREE.SmoothShading;

      const objLoader = new THREE.OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(model.objPath, (object) => {
        // Adjust the position, rotation, and scale of the model as specified
        object.position.copy(model.position);
        object.rotation.copy(model.rotation);
        object.scale.copy(model.scale);

        // Enable shadow casting and receiving for the meshes
        object.traverse((node) => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        // Create object collider
        const objectBoundingBox = new THREE.Box3().setFromObject(object);
        object.userData.collider = objectBoundingBox;

        // Mark the object as collidable
        object.userData.collidable = true;

        // Add the model to the scene
        scene.add(object);

        if (model.isGun) {
          gunModel = object;
          delete object.userData.collider; // Exclude gun object from collision detection
        }

        // Create a square at the position of the OBJ model
        const squareGeometry = new THREE.BoxGeometry(2, 5, 2);
        const squareMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        const squareMesh = new THREE.Mesh(squareGeometry, squareMaterial);
        squareMesh.opacity.copy(0);
        squareMesh.position.copy(object.position);
        scene.add(squareMesh);
      });
    });
  });
}
function addFog(color, near, far) {
  scene.fog = new THREE.Fog(color, near, far);
}

function checkCameraBoxCollision() {
  // Get the bounding boxes of the camera and the squareMesh
  const cameraBoundingBox = new THREE.Box3().setFromObject(camera);
  const squareBoundingBox = new THREE.Box3().setFromObject(squareMesh);

  // Check for intersection
  if (cameraBoundingBox.intersectsBox(squareBoundingBox)) {
    return true; // Collision detected
  } else {
    return false; // No collision
  }
}






function addLights() {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0x303030, 0.2); // Dark ambient light
  scene.add(ambientLight);



  // Directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2); // Bright directional light
  directionalLight.position.set(3, 10, -1);
  directionalLight.castShadow = true; // Enable shadow casting
  directionalLight.shadow.mapSize.width = 2048; // Increased shadow map size
  directionalLight.shadow.mapSize.height = 2048; // Increased shadow map size

  // Set shadow properties for the directional light
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 100;
  directionalLight.shadow.camera.left = -80; // Increased shadow camera boundaries
  directionalLight.shadow.camera.right = 80; // Increased shadow camera boundaries
  directionalLight.shadow.camera.top = 80; // Increased shadow camera boundaries
  directionalLight.shadow.camera.bottom = -80; // Increased shadow camera boundaries

  scene.add(directionalLight);
}

const keys = {
  FORWARD: 's',
  BACKWARD: 'w',
  LEFT: 'a',
  RIGHT: 'd',
  LOCK_CURSOR: 'q',
  DASH: ' ',
  SHOOT: 'Mouse0',
  ENEMY_SPEED: 'f',
  RELOAD: 'r',
};

const movement = {
  forward: false,
  backward: false,
  left: false,
  right: false,
};


const walkSound = new Audio('walk.mp3');
walkSound.loop = true; // Enable looping for the walk sound
let isWalking = false;

function onKeyDown(event) {
  const key = event.key.toLowerCase();

  if (key === keys.FORWARD) movement.forward = true;
  if (key === keys.BACKWARD) movement.backward = true;
  if (key === keys.LEFT) movement.left = true;
  if (key === keys.RIGHT) movement.right = true;

  if (!isWalking) {
    isWalking = true;
    walkSound.currentTime = 0;
    walkSound.play();
  }
  if (key === keys.LOCK_CURSOR) {
    if (!controlsEnabled) {
      renderer.domElement.requestPointerLock();
    }
  }

  if (key === keys.DASH && dashMeter > 10) {
    if (!movement.dash) {
      movement.dash = true; // Trigger dash action
      movementSpeed = dashSpeed; // Set movement speed to dash speed
      walkSound.playbackRate = 3;
      dashMeter -= 25; // Deduct 25 units from dash meter
      if (dashMeter < 0) {
        dashMeter = 0; // Ensure dash meter does not go below 0
      }
      renderer.domElement.style.filter = 'blur(2px)';
      updateDashMeter();

      // Start interval to continuously decrease dash meter while the dash key is held down
      dashMeterInterval = setInterval(() => {
        dashMeter -= 10; // Deduct 10 units from dash meter
        if (dashMeter < 0) {
          renderer.domElement.style.filter = 'blur(0px)';
        }
        updateDashMeter();

        if (dashMeter === 0) {
          // Dash meter reached 0, set movement speed back to normal
          movementSpeed = normalSpeed;
          clearInterval(dashMeterInterval);
        }
      }, 1000);
    }
  }

  if (key === keys.RELOAD) {
    setTimeout(() => {
      reload += 20;
    }, 1000);
    const sound = new Audio('reload.wav');
    sound.play();
}
}
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);


function onKeyUp(event) {
  const key = event.key.toLowerCase();

  if (key === keys.FORWARD) movement.forward = false;
  if (key === keys.BACKWARD) movement.backward = false;
  if (key === keys.LEFT) movement.left = false;
  if (key === keys.RIGHT) movement.right = false;

  if (!movement.forward && !movement.backward && !movement.left && !movement.right) {
    isWalking = false;
    walkSound.pause();
  }
  if (key === keys.DASH) {
    clearInterval(dashMeterInterval);
    movement.dash = false; // Stop dashing
    renderer.domElement.style.filter = 'none';
    walkSound.playbackRate = 1;
    movementSpeed = 0.2; // Set movement speed back to normal
    console.log(dashMeter); // Log the value of dashMeter
    updateDashMeter(); // Update the dash meter element
  }
}

// Increase dash meter by 5 every second
setInterval(() => {
  if (!movement.dash && dashMeter < 100) {
    dashMeter += 2; // Increase dash meter by 5
    if (dashMeter > 100) {
      dashMeter = 100; // Cap dash meter at 100%
    }
    console.log(dashMeter); // Log the value of dashMeter
    updateDashMeter();// Update the dash meter element
  }
}, 1000); // Execute every 1000 milliseconds (1 second)


document.addEventListener('click', onClick);

function onClick(event) {
  if (event.button === 0 && controlsEnabled && bulletCount < reload && !isRecoiling) {
    // Set the gun recoil flag
    isRecoiling = true;

    // Calculate the direction of the bullet based on the camera's rotation
    const bulletDirection = new THREE.Vector3();
    camera.getWorldDirection(bulletDirection);

    // Create the bullet geometry
    const bulletGeometry = new THREE.SphereGeometry(0.08, 32, 32);

    // Create the bullet material with white color and blue emissive glow
    const bulletMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      transparent: true,
      opacity: 0.3
    });

    // Create the bullet mesh
    const bulletMesh = new THREE.Mesh(bulletGeometry, bulletMaterial);
    bulletMesh.castShadow = true;

    // Set the bullet's initial position at the camera's position
    bulletMesh.position.copy(camera.position);

    // Set the bullet's velocity based on the bullet direction
    const bulletSpeed = 9;
    const bulletVelocity = bulletDirection.clone().multiplyScalar(bulletSpeed);
    bulletMesh.userData.velocity = bulletVelocity;

    // Add the bullet to the scene and bullets array
    scene.add(bulletMesh);
    bullets.push(bulletMesh);
    

    bulletCount++; // Increment the bullet count
    
    const sound = new Audio('gunShoot.mp3');
    sound.play();
    gunModel.position.z -= recoilDistance;

    // Set a timeout to return the gun to the normal position after the recoil duration
    setTimeout(() => {
      gunModel.position.z += recoilDistance;
      isRecoiling = false; // Reset the recoil flag
    }, recoilDuration * 1000);
  }
}


function onPointerLockChange() {
  controlsEnabled =
    document.pointerLockElement === renderer.domElement ||
    document.mozPointerLockElement === renderer.domElement;
}

// Handle mouse movement for camera rotation
let rotationSpeed = 0.02;
let currentRotation = { x: 0, y: 0 };

function onMouseMove(event) {
  if (!controlsEnabled) return;

  const mouseDeltaX = event.movementX || event.mozMovementX || 0;
  const mouseDeltaY = event.movementY || event.mozMovementY || 0;

  const euler = new THREE.Euler(
    currentRotation.x,
    currentRotation.y,
    0,
    'YXZ' // Set the rotation order to match human eyes
  );

  euler.y -= mouseDeltaX * rotationSpeed;
  euler.x -= mouseDeltaY * rotationSpeed;

  // Limit the vertical rotation
  euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x));

  currentRotation.x = euler.x;
  currentRotation.y = euler.y;

  camera.quaternion.setFromEuler(euler);

  prevMouseX = event.clientX;
}

function animateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];

    // Move the bullet forward
    const bulletSpeed = 0.1;
    bullet.position.add(bullet.userData.velocity.clone().multiplyScalar(bulletSpeed));

    // Check if the bullet hits a target
    if (isBulletHittingTarget(bullet)) {
      handleBulletHit(bullet);
      continue; // Skip the rest of the loop for this bullet
    }

    // Remove bullets that are out of bounds
    if (
      bullet.position.x < -50 ||
      bullet.position.x > 50 ||
      bullet.position.y < -50 ||
      bullet.position.y > 50 ||
      bullet.position.z < -50 ||
      bullet.position.z > 50
    ) {
      scene.remove(bullet);
      bullets.splice(i, 1);
    }
  }
}



let isTimerRunning = false;
let score = 0;
let enemySpawnCount = 12;
let timer;

function startTimer() {
  isTimerRunning = true;
  let startTime = Date.now();

  function updateTimer() {
    if (!isTimerRunning) return;

    let elapsedTime = Date.now() - startTime;
    let seconds = Math.floor(elapsedTime / 1000);
    document.getElementById("timer").textContent = seconds;

    requestAnimationFrame(updateTimer);
  }

  updateTimer();
}

function stopTimer() {
  isTimerRunning = false;
  clearInterval(timer);
}

function handleBulletHit(bullet) {
  if (!isTimerRunning) {
    startTimer();
  }

  const collisionRange = 2; // Adjust this value based on the desired collision range
  const yOffset = -1; // Adjust this value based on the desired offset on the y-axis
  const sparkCount = 10; // Number of sparks to create

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const distanceX = Math.abs(bullet.position.x - enemy.position.x);
    const distanceY = Math.abs(bullet.position.y - enemy.position.y + yOffset);
    const distanceZ = Math.abs(bullet.position.z - enemy.position.z);

    if (distanceX < collisionRange && distanceY < collisionRange && distanceZ < collisionRange) {
      // Play the sound effect
      const sound = new Audio('ghostSound.mp3');
      sound.play();

      // Remove the enemy from the scene
      scene.remove(enemy);
      enemies.splice(i, 1);
      i--; // Decrement the loop counter to account for the removed enemy

        // Create cube sparks
        const numSparks = 8; // Number of sparks to create
        const sparkSize = 0.15; // Size of the sparks
        const sparkDuration = 3000; // Duration of the sparks in milliseconds
        const sparkVelocity = new THREE.Vector3(0, -0.015, 0); // Downward velocity of the sparks
        
        for (let j = 0; j < numSparks; j++) {
          const sparkGeometry = new THREE.BoxGeometry(sparkSize, sparkSize, sparkSize);
          const sparkMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.7, transparent: true });
          const spark = new THREE.Mesh(sparkGeometry, sparkMaterial);
        
          // Randomize the spark's position around the bullet removal position
          const offsetRange = 1; // Maximum offset range for each axis
          const offsetX = Math.random() * offsetRange * 2 - offsetRange;
          const offsetY = Math.random() * offsetRange * 2 - offsetRange;
          const offsetZ = Math.random() * offsetRange * 2 - offsetRange;
        
          spark.position.x = bullet.position.x + offsetX;
          spark.position.y = bullet.position.y + offsetY;
          spark.position.z = bullet.position.z + offsetZ;
        
          scene.add(spark); // Add each spark to the scene
        
          // Update the position of the spark in each frame update
          const updateSparkPosition = () => {
            spark.position.add(sparkVelocity);
            requestAnimationFrame(updateSparkPosition);
          };
          updateSparkPosition();
        
          // Schedule the removal of the spark after the specified duration
          setTimeout(() => {
            scene.remove(spark);
          }, sparkDuration);
        }
        
      // Schedule the removal of the spark group after the specified duration
      setTimeout(() => {
        scene.remove(sparkGroup);
      }, sparkDuration);
      // Remove the bullet from the scene
      scene.remove(bullet);
      bullets.splice(bullets.indexOf(bullet), 1);

      // Update the score
      score++;
      updateScore();

      // Check if the score matches the enemySpawnCount
      if (score === enemySpawnCount) {
        stopTimer();
      }

      return; // Exit the function since the collision has been handled
    }
  }
}



// Define the current level variable
let level = 1;


function createCongratsOverlay(message, buttonText, nextLevel) {
  // Create the overlay element
  const overlay = document.createElement('div');
  overlay.id = 'congrats-overlay';

  // Set the background color and opacity
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';

  // Create the congrats message element
  const congratsMessage = document.createElement('h1');
  congratsMessage.style.color = 'white';
  congratsMessage.innerText = message;
  

const nextLevelButton = document.createElement('button');
nextLevelButton.style.position = 'absolute';
nextLevelButton.style.top = '50%'; // Center the button vertically
nextLevelButton.style.left = '50%'; // Center the button horizontally
nextLevelButton.style.transform = 'translate(-50%, 300%)';
nextLevelButton.innerText = buttonText;


  // Add event listener for the next level button
  nextLevelButton.addEventListener('click', function() {
    setTimeout(function() {
      spawnEnemies(nextLevel);
    }, 5000);

    // Reset the score to 0 and update the display
    score = 0;
    updateScore();
    camera.position.set(0, 1, 0);

    // Hide the overlay
    overlay.style.display = 'none';
  });

  // Add the congrats message and next level button to the overlay
  overlay.appendChild(congratsMessage);
  overlay.appendChild(nextLevelButton);

  // Add the overlay to the document body
  document.body.appendChild(overlay);
}

function createFinishOverlay(message, smallmessage, buttonText) {
  // Create the overlay element
  const overlay = document.createElement('div');
  overlay.id = 'Finish-overlay';

  // Set the background color and opacity
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.display = 'flex';
  overlay.style.flexDirection = 'column';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';

  // Create the congrats message element
  const congratsMessage = document.createElement('h1');
  congratsMessage.style.color = 'white';
  congratsMessage.style.marginBottom = '20px'; // Add margin to create space below

  congratsMessage.innerText = message;

  const smallMessage = document.createElement('h1');
  smallMessage.style.color = 'white';
  smallMessage.innerText = smallmessage;


  // Add the congrats message, small message, and exit button to the overlay
  overlay.appendChild(congratsMessage);
  overlay.appendChild(smallMessage);

  // Add the overlay to the document body
  document.body.appendChild(overlay);
}


function updateScore() {
  const scoreElement = document.getElementById('score');
  scoreElement.textContent = `Score: ${score}`;

  if (level === 1 && score === 12) {
    // Transition from level 1 to level 2
    level = 2;
    createCongratsOverlay(`Congratulations! You reached ${document.getElementById("timer").textContent} points!`, 'Next Level', 2);
  } else if (level === 2 && score === 13) {
    // Transition from level 2 to level 3
    level = 3;
    createCongratsOverlay(`Congratulations! You reached ${document.getElementById("timer").textContent} points!`, 'Next Level', 3);
  } else if (level === 3 && score === 14) {
    // Game completion
    createFinishOverlay('CONGRATULATIONS!','You have completed the game!');
  }
}

    

function updateGunPosition() {
  const gunOffset = new THREE.Vector3(0.5, -0.54, -0.2); // Offset from the camera position
  const gunPosition = new THREE.Vector3();
  const gunRotation = new THREE.Quaternion();

  gunOffset.applyQuaternion(camera.quaternion); // Apply camera rotation to the offset vector

  const time = performance.now() * 0.001; // Get the current time in seconds

  const verticalOffset = Math.sin(time * 2) * 0.02; // Adjust the vertical offset based on a sine wave

  gunPosition.copy(camera.position).add(gunOffset).add(new THREE.Vector3(0, verticalOffset, 0));
  gunModel.position.copy(gunPosition);
  if (isRecoiling) {
    const recoilOffset = new THREE.Vector3(0, 0, -recoilDistance);
    recoilOffset.applyQuaternion(camera.quaternion);
    gunModel.position.add(recoilOffset);
  }

  gunRotation.copy(camera.quaternion); // Copy camera rotation to the gun's rotation

  // Apply a 180-degree rotation around the y-axis
  // Apply an additional rotation around the y-axis to fix the gun's orientation
  gunRotation.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2));

  gunModel.quaternion.copy(gunRotation);
}



function animate() {
  requestAnimationFrame(animate);
  moveEnemies();
  animateBullets(); // Add this line
  updateGunPosition();
  sceneSound.play();

  const cameraDirection = new THREE.Vector3();
  camera.getWorldDirection(cameraDirection);

  // Update camera position based on movement controls
  const speed = 0.1;
  const nextPosition = camera.position.clone();

  if (movement.forward) {
    const forwardDirection = cameraDirection.clone().multiplyScalar(-speed);
    nextPosition.add(forwardDirection);
    
  }
  if (movement.backward) {
    const backwardDirection = cameraDirection.clone().multiplyScalar(speed);
    nextPosition.add(backwardDirection);
  }
  if (movement.left) {
    const leftDirection = cameraDirection.clone().cross(new THREE.Vector3(0, 1, 0)).multiplyScalar(-speed);
    nextPosition.add(leftDirection);
  }
  if (movement.right) {
    const rightDirection = cameraDirection.clone().cross(new THREE.Vector3(0, 1, 0)).multiplyScalar(speed);
    nextPosition.add(rightDirection);
  }
  if (movement.dash) {
    if (movement.forward) {
      // Calculate the forward direction based on the camera's rotation
      const forwardDirection = cameraDirection.clone().multiplyScalar(-movementSpeed);

      // Apply the forward direction to the next position
      nextPosition.add(forwardDirection);
    }
    if (movement.backward) {
      // Calculate the backward direction based on the camera's rotation
      const backwardDirection = cameraDirection.clone().multiplyScalar(movementSpeed);

      // Apply the backward direction to the next position
      nextPosition.add(backwardDirection);
    }
    if (movement.left) {
      // Calculate the left direction based on the camera's rotation
      const leftDirection = cameraDirection.clone().cross(new THREE.Vector3(0, 1, 0)).multiplyScalar(-movementSpeed);

      // Apply the left direction to the next position
      nextPosition.add(leftDirection);
    }
    if (movement.right) {
      // Calculate the right direction based on the camera's rotation
      const rightDirection = cameraDirection.clone().cross(new THREE.Vector3(0, 1, 0)).multiplyScalar(movementSpeed);

      // Apply the right direction to the next position
      nextPosition.add(rightDirection);
    }
  }

  
  // Update the camera position
  camera.position.copy(nextPosition);
  
  

  // Check if the next position is within the floor boundaries
  const floorSizeX = 80; // Adjust the size of the floor in the X direction
  const floorSizeZ = 80; // Adjust the size of the floor in the Z direction

  nextPosition.x = Math.max(-floorSizeX / 2, Math.min(floorSizeX / 2, nextPosition.x));
  nextPosition.z = Math.max(-floorSizeZ / 2, Math.min(floorSizeZ / 2, nextPosition.z));

  // Apply gravity
  const gravity = 0.1;
  const gravityDirection = new THREE.Vector3(0, -gravity, 0);
  nextPosition.add(gravityDirection);

  // Check for collision with the floor
  if (nextPosition.y < 0) {
    nextPosition.y = 0;
  }



camera.position.y = Math.max(0, Math.min(3, camera.position.y));


  camera.position.copy(nextPosition);
  

  // Limit the camera's Y position within the boundaries
  camera.position.y = Math.max(0, Math.min(3, camera.position.y));

  // Check for collisions between bullets and enemies
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];
    handleBulletHit(bullet);
  }
    
    
  

  animateBullets(); // Call the function to animate the bullets

  // Render the scene
  renderer.render(scene, camera);
 
}






// Initialize and start the game
init();

document.addEventListener('mousemove', onMouseMove, false);
animate();
