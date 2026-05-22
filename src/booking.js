import * as THREE from 'three'

const DEST_POSITIONS = {
  'Colombo':      [-1.5, -0.5],
  'Galle':        [-0.6, -2.2],
  'Kandy':        [ 0.1, -0.2],
  'Sigiriya':     [ 0.4,  0.8],
  'Ella':         [ 0.7, -1.0],
  'Nuwara Eliya': [ 0.2, -0.6],
  'Mirissa':      [-0.2, -2.4],
  'Hikkaduwa':    [-1.1, -1.8],
  'Arugam Bay':   [ 1.7, -0.5],
  'Jaffna':       [ 0.1,  2.6],
  'Trincomalee':  [ 1.3,  1.4],
  'Bentota':      [-1.4, -1.2],
  'Yala':         [ 1.1, -1.8],
  'Pasikuda':     [ 1.5,  0.4],
  'Polonnaruwa':  [ 0.7,  0.3],
  'Negombo':      [-1.5,  0.2],
}

export const DEST_PRICES = {
  'Colombo':       { car: 30,  van: 52  },
  'Galle':         { car: 55,  van: 90  },
  'Kandy':         { car: 58,  van: 95  },
  'Sigiriya':      { car: 72,  van: 118 },
  'Ella':          { car: 68,  van: 110 },
  'Nuwara Eliya':  { car: 63,  van: 105 },
  'Mirissa':       { car: 58,  van: 95  },
  'Hikkaduwa':     { car: 50,  van: 82  },
  'Arugam Bay':    { car: 85,  van: 138 },
  'Jaffna':        { car: 95,  van: 155 },
  'Trincomalee':   { car: 78,  van: 128 },
  'Bentota':       { car: 48,  van: 80  },
  'Yala':          { car: 78,  van: 125 },
  'Pasikuda':      { car: 78,  van: 128 },
  'Polonnaruwa':   { car: 70,  van: 115 },
  'Negombo':       { car: 35,  van: 58  },
}

export function initBookingScene(containerId) {
  const container = document.getElementById(containerId)
  if (!container) return null

  // ---- Renderer ----
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x060c1a)

  function resize() {
    const w = container.clientWidth
    const h = container.clientHeight
    if (w === 0 || h === 0) return
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }

  container.appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x060c1a)

  // ---- Camera ----
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100)
  camera.position.set(0, 1, 9)
  camera.lookAt(0, 0, 0)

  resize()

  // ---- Lighting ----
  const ambientLight = new THREE.AmbientLight(0x223355, 1.5)
  scene.add(ambientLight)

  const dirLight = new THREE.DirectionalLight(0xffeedd, 1.2)
  dirLight.position.set(4, 8, 5)
  scene.add(dirLight)

  const pointLight = new THREE.PointLight(0x4488ff, 1.5, 20)
  pointLight.position.set(-3, 4, 4)
  scene.add(pointLight)

  // ---- Stars ----
  const starCount = 3200
  const starPositions = new Float32Array(starCount * 3)
  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3 + 0] = (Math.random() - 0.5) * 80
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 80
    starPositions[i * 3 + 2] = (Math.random() - 0.5) * 80
  }
  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
  const starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1, sizeAttenuation: true })
  const starField = new THREE.Points(starGeo, starMat)
  scene.add(starField)

  // ---- Ocean plane ----
  const oceanGeo = new THREE.PlaneGeometry(30, 30)
  const oceanMat = new THREE.MeshPhongMaterial({
    color: 0x041530,
    shininess: 80,
    specular: new THREE.Color(0x1144aa),
  })
  const ocean = new THREE.Mesh(oceanGeo, oceanMat)
  ocean.rotation.x = -Math.PI / 2
  ocean.position.y = -0.5
  scene.add(ocean)

  // ---- Sri Lanka island shape ----
  // Roughly teardrop shape oriented north-south
  const islandShape = new THREE.Shape()
  const pts = [
    [0.0,  2.9],
    [0.6,  2.3],
    [1.2,  1.5],
    [1.6,  0.6],
    [1.75, -0.2],
    [1.6,  -1.0],
    [1.1,  -1.7],
    [0.7,  -2.2],
    [0.2,  -2.6],
    [-0.3, -2.7],
    [-0.8, -2.4],
    [-1.2, -1.9],
    [-1.6, -1.3],
    [-1.8, -0.6],
    [-1.75, 0.2],
    [-1.5,  0.9],
    [-1.0,  1.7],
    [-0.3,  2.5],
    [0.0,  2.9],
  ]
  islandShape.moveTo(pts[0][0], pts[0][1])
  for (let i = 1; i < pts.length; i++) {
    islandShape.lineTo(pts[i][0], pts[i][1])
  }
  islandShape.closePath()

  const extrudeSettings = {
    depth: 0.25,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.06,
    bevelSegments: 3,
  }
  const islandGeo = new THREE.ExtrudeGeometry(islandShape, extrudeSettings)
  islandGeo.center()

  const islandMat = new THREE.MeshPhongMaterial({
    color: 0x2d6a2d,
    shininess: 30,
    specular: new THREE.Color(0x446633),
  })
  const island = new THREE.Mesh(islandGeo, islandMat)
  island.rotation.x = -Math.PI / 2
  island.position.y = -0.3
  scene.add(island)

  // ---- Destination markers ----
  const markerGroup = new THREE.Group()
  scene.add(markerGroup)

  const markerMeshes = {}
  const ringMeshes = {}
  const markerBaseColor = new THREE.Color(0xad9a62)
  const markerActiveColor = new THREE.Color(0xffd700)

  Object.entries(DEST_POSITIONS).forEach(([name, [mx, my]]) => {
    // Sphere marker
    const geo = new THREE.SphereGeometry(0.1, 16, 16)
    const mat = new THREE.MeshPhongMaterial({
      color: markerBaseColor.clone(),
      emissive: new THREE.Color(0x6b5c20),
      shininess: 80,
    })
    const mesh = new THREE.Mesh(geo, mat)
    // Island is rotated -PI/2 on X and centered; map 2D (mx, my) -> 3D
    // Island shape x-axis stays x, y-axis of shape becomes Z (since rotated)
    mesh.position.set(mx, 0.1, -my - 0.15) // offset for island centering approx
    markerMeshes[name] = mesh
    markerGroup.add(mesh)

    // Spinning ring under marker
    const ringGeo = new THREE.TorusGeometry(0.18, 0.025, 8, 32)
    const ringMat = new THREE.MeshPhongMaterial({
      color: 0xad9a62,
      emissive: new THREE.Color(0x3d2e00),
      transparent: true,
      opacity: 0.7,
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.position.set(mx, 0.02, -my - 0.15)
    ring.rotation.x = Math.PI / 2
    ringMeshes[name] = ring
    markerGroup.add(ring)
  })

  // ---- Vehicle group ----
  let vehicleMesh = null
  const vehicleGroup = new THREE.Group()
  vehicleGroup.position.set(3.2, 0.0, 2.0)
  scene.add(vehicleGroup)

  function buildCar() {
    const group = new THREE.Group()
    // Body
    const bodyGeo = new THREE.BoxGeometry(1.2, 0.35, 0.55)
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0x1155aa, shininess: 100 })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    body.position.y = 0.22
    group.add(body)
    // Cabin
    const cabinGeo = new THREE.BoxGeometry(0.75, 0.28, 0.48)
    const cabin = new THREE.Mesh(cabinGeo, bodyMat)
    cabin.position.set(-0.05, 0.51, 0)
    group.add(cabin)
    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.1, 12)
    const wheelMat = new THREE.MeshPhongMaterial({ color: 0x222222 })
    const wheelPositions = [[-0.42, 0.12, 0.3], [0.42, 0.12, 0.3], [-0.42, 0.12, -0.3], [0.42, 0.12, -0.3]]
    wheelPositions.forEach(([wx, wy, wz]) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat)
      w.position.set(wx, wy, wz)
      w.rotation.z = Math.PI / 2
      group.add(w)
    })
    return group
  }

  function buildVan() {
    const group = new THREE.Group()
    // Body (taller box)
    const bodyGeo = new THREE.BoxGeometry(1.3, 0.65, 0.6)
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0xcc8811, shininess: 80 })
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    body.position.y = 0.4
    group.add(body)
    // Wheels
    const wheelGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.12, 12)
    const wheelMat = new THREE.MeshPhongMaterial({ color: 0x222222 })
    const wheelPositions = [[-0.48, 0.14, 0.32], [0.48, 0.14, 0.32], [-0.48, 0.14, -0.32], [0.48, 0.14, -0.32]]
    wheelPositions.forEach(([wx, wy, wz]) => {
      const w = new THREE.Mesh(wheelGeo, wheelMat)
      w.position.set(wx, wy, wz)
      w.rotation.z = Math.PI / 2
      group.add(w)
    })
    return group
  }

  // ---- Route arc ----
  let routeLine = null
  const airportPos = new THREE.Vector3(-1.5, 0.1, -0.35) // near Colombo/Negombo (airport)

  function clearRoute() {
    if (routeLine) {
      scene.remove(routeLine)
      routeLine.geometry.dispose()
      routeLine.material.dispose()
      routeLine = null
    }
  }

  function drawRoute(destName) {
    clearRoute()
    const pos = DEST_POSITIONS[destName]
    if (!pos) return
    const destVec = new THREE.Vector3(pos[0], 0.4, -pos[1] - 0.15)
    const midPoint = new THREE.Vector3(
      (airportPos.x + destVec.x) / 2,
      Math.max(airportPos.y, destVec.y) + 1.2,
      (airportPos.z + destVec.z) / 2
    )
    const curve = new THREE.QuadraticBezierCurve3(airportPos, midPoint, destVec)
    const points = curve.getPoints(60)
    const geo = new THREE.BufferGeometry().setFromPoints(points)
    const mat = new THREE.LineBasicMaterial({ color: 0xffd700, linewidth: 2, transparent: true, opacity: 0.85 })
    routeLine = new THREE.Line(geo, mat)
    scene.add(routeLine)
  }

  // ---- Particle burst ----
  const burst = []
  function triggerBurst(x, z) {
    for (let i = 0; i < 40; i++) {
      const geo = new THREE.SphereGeometry(0.04, 6, 6)
      const mat = new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 1 })
      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(x, 0.1, z)
      const angle = (Math.PI * 2 * i) / 40 + (Math.random() - 0.5) * 0.3
      const speed = 0.04 + Math.random() * 0.05
      mesh.userData.vx = Math.cos(angle) * speed
      mesh.userData.vz = Math.sin(angle) * speed
      mesh.userData.vy = 0.02 + Math.random() * 0.03
      mesh.userData.life = 1.0
      scene.add(mesh)
      burst.push(mesh)
    }
  }

  // ---- Selected state ----
  let selectedDestName = ''
  let cameraTargetY = 1

  function selectDestination(name) {
    // Reset previous
    if (selectedDestName && markerMeshes[selectedDestName]) {
      markerMeshes[selectedDestName].material.color.set(markerBaseColor)
      markerMeshes[selectedDestName].material.emissive.set(0x6b5c20)
      markerMeshes[selectedDestName].scale.setScalar(1)
    }
    selectedDestName = name
    if (!name || !markerMeshes[name]) return

    // Highlight
    markerMeshes[name].material.color.set(markerActiveColor)
    markerMeshes[name].material.emissive.set(0x806010)
    markerMeshes[name].scale.setScalar(2.0)

    // Particle burst
    const pos = DEST_POSITIONS[name]
    triggerBurst(pos[0], -pos[1] - 0.15)

    // Arc route
    drawRoute(name)

    // Camera target
    const destY = pos[1]
    cameraTargetY = 1 + destY * 0.1
  }

  function selectVehicle(type) {
    // Remove old vehicle
    while (vehicleGroup.children.length > 0) {
      const c = vehicleGroup.children[0]
      c.geometry && c.geometry.dispose()
      c.material && c.material.dispose()
      vehicleGroup.remove(c)
    }
    vehicleMesh = type === 'van' ? buildVan() : buildCar()
    vehicleGroup.add(vehicleMesh)
  }

  // ---- Animation ----
  let animId = null
  let time = 0

  function animate() {
    animId = requestAnimationFrame(animate)
    time += 0.01

    // Stars rotate slowly
    starField.rotation.y = time * 0.02
    starField.rotation.x = time * 0.005

    // Island float
    island.position.y = -0.3 + Math.sin(time * 0.5) * 0.04

    // Marker pulse
    Object.entries(markerMeshes).forEach(([name, mesh]) => {
      const s = name === selectedDestName
        ? 2.0 + Math.sin(time * 4) * 0.25
        : 1.0 + Math.sin(time * 3 + mesh.position.x) * 0.12
      mesh.scale.setScalar(s)
    })

    // Ring spin
    Object.values(ringMeshes).forEach((ring, i) => {
      ring.rotation.z = time * (1.2 + i * 0.1)
      ring.position.y = island.position.y + 0.32
    })

    // Marker y follows island
    Object.entries(markerMeshes).forEach(([, mesh]) => {
      mesh.position.y = island.position.y + 0.4
    })

    // Vehicle slow rotate
    if (vehicleGroup.children.length > 0) {
      vehicleGroup.rotation.y = time * 0.5
    }

    // Camera sway + lerp toward destination
    const swayX = Math.sin(time * 0.3) * 0.4
    camera.position.x += (swayX - camera.position.x) * 0.01
    camera.position.y += (cameraTargetY - camera.position.y) * 0.02
    camera.lookAt(0, 0, 0)

    // Particle burst update
    for (let i = burst.length - 1; i >= 0; i--) {
      const p = burst[i]
      p.userData.life -= 0.025
      p.position.x += p.userData.vx
      p.position.y += p.userData.vy
      p.position.z += p.userData.vz
      p.userData.vy -= 0.001
      p.material.opacity = p.userData.life
      if (p.userData.life <= 0) {
        scene.remove(p)
        p.geometry.dispose()
        p.material.dispose()
        burst.splice(i, 1)
      }
    }

    renderer.render(scene, camera)
  }

  // Wait until container has size (may be 0 on initial load)
  function waitAndStart() {
    if (container.clientWidth > 0 && container.clientHeight > 0) {
      resize()
      animate()
    } else {
      requestAnimationFrame(waitAndStart)
    }
  }
  waitAndStart()

  // ResizeObserver for layout changes
  const ro = new ResizeObserver(() => resize())
  ro.observe(container)

  function destroy() {
    cancelAnimationFrame(animId)
    ro.disconnect()
    renderer.dispose()
    if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement)
  }

  return { selectDestination, selectVehicle, destroy }
}
