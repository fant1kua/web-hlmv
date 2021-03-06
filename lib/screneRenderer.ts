import * as THREE                from 'three'
import * as orbitControlsCreator from 'three-orbit-controls'
import { ModelController }       from './modelController'

/*
 * Allow the camera to orbit around a target
 */
const OrbitControls: typeof THREE.OrbitControls = orbitControlsCreator(THREE)

/**
 * Creates orbit controller
 * @param domElement HTML canvas element
 */
const createOrbitControls = (camera: THREE.Camera, domElement?: HTMLElement) => {
  const orbit = new OrbitControls(camera, domElement)

  orbit.enableKeys = true
  orbit.enableZoom = true

  return orbit
}

/**
 * Creates lights for the scene
 * @param color Lights color
 */
const createLights = (color: number = 0xffffff): THREE.Light[] => {
  const ambientLight = new THREE.AmbientLight(color)
  const lights = []

  lights[0] = new THREE.PointLight(color, 1, 0)
  lights[1] = new THREE.PointLight(color, 1, 0)
  lights[2] = new THREE.PointLight(color, 1, 0)

  lights[0].position.set(0, 200, 0)
  lights[1].position.set(100, 200, 100)
  lights[2].position.set(-100, -200, -100)

  return [ambientLight, lights[0], lights[1], lights[2]]
}

/**
 * Starts drawing frames of the renderer
 */
const runRenderer = (
  renderer: THREE.Renderer,
  scene: THREE.Scene,
  camera: THREE.Camera,
  controls: THREE.OrbitControls,
  clock: THREE.Clock,
  modelController: ModelController
) => {
  const drawKeyframe = () => {
    requestAnimationFrame(drawKeyframe)
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update()

    const delta = clock.getDelta()
    modelController.update(delta)

    renderer.render(scene, camera)
  }

  drawKeyframe()
}

/**
 * Binds renderer resize
 */
const bindRendererResize = (camera: THREE.PerspectiveCamera, renderer: THREE.Renderer) => {
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  })
}

export const renderScene = (
  canvas: HTMLCanvasElement,
  modelController: ModelController,
  initDistance = 80
): THREE.Scene => {
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = initDistance

  const orbitControls = createOrbitControls(camera, canvas)

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)

  // Set background
  renderer.setClearColor(0x0, 0)

  // Adding lights to the scene
  const lights = createLights()
  scene.add(...lights)

  const clock = new THREE.Clock()
  runRenderer(renderer, scene, camera, orbitControls, clock, modelController)

  bindRendererResize(camera, renderer)

  return scene
}
