import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { LoopOnce, SphereGeometry, TextureLoader } from 'three'
import CANNON, { Sphere } from 'cannon'
import $ from "./Jquery"




const textureLoader = new THREE.TextureLoader()

// Canvas
const canvas = document.querySelector('canvas.webgl')
// Scene
const scene = new THREE.Scene()
//raycaster
const raycaster = new THREE.Raycaster()

//cannon

const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = true
world.gravity.set(0, - 9.82, 0)

const defaultMaterial = new CANNON.Material('default')
const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
        friction: 30,
        restitution: 0.1
    }
)

const objectsToUpdate = []


 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}



window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

 

})

const randomColors = [new THREE.Color("orange"), new THREE.Color("AFFF33"), new THREE.Color( "33BEFF"), new THREE.Color("3C21A9")]

const selectMaterial = new THREE.MeshStandardMaterial({color:'orange'})




let bull
let bullMixer
let bullWalk
let bullModel
let bullDots

let bird
let birdMixer
let birdFlight
let birdModel

let whale
let whaleMixer
let whaleSwim
let whaleModel
let activation = "off"
$('body').click(()=>{console.log("click");
activation = "on"
})
// setInterval(() => {
//     if(activation=="off"){
//         activation="on"
//     }
//     setTimeout(() => {
//         activation="off"
        
//     }, 100);
// }, 200);


let bullActivation = "off";
let birdActivation = "off";
let whaleActivation = "off";

const mouse = new THREE.Vector2()
mouse.x = null
mouse.y=null
mouse.y2 = null

window.addEventListener('mousemove', (event) =>

{
   
   
    mouse.x = event.clientX / sizes.width * 2 - 1
    mouse.y = - (event.clientY / sizes.height) * 2 + 1
    mouse.y2 =-(event.clientY / sizes.height)
   


})



const gltfLoader = new GLTFLoader()

gltfLoader.load(
    '/bull.glb',
    (gltf) =>
    {
        
        bull=gltf.scene
        console.log(bull);


        let bullDotCoordinates = bull.children[0].children[4].children[1].geometry.attributes.position.array;
        

        //createbulldots 
        const bullDotColors = new Float32Array(bullDotCoordinates.length * 3)
        const colorInside = new THREE.Color('red')
        const colorOutside = new THREE.Color('blue')
        const colorInside2 = new THREE.Color('green')
        const colorOutside2 = new THREE.Color('yellow')

        for(let i = 0; i < bullDotCoordinates.length; i++)
    {
    const i3 = i * 3
    const mixedColor = colorInside.clone()  
    mixedColor.lerp(colorOutside, bull.children[0].children[4].children[1].geometry.attributes.position.array[i3+1]/2+.5)
    bullDotColors[i3    ] = mixedColor.r
    bullDotColors[i3 + 1] = mixedColor.g
    bullDotColors[i3 + 2] = mixedColor.b
    }   

    let pixleMaterial = new THREE.PointsMaterial({
        color:"red",
        size:.3,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    let bullDotsGeometry = new THREE.BufferGeometry;
        
    bullDotsGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(bullDotCoordinates,3)
    )
    bullDotsGeometry.setAttribute(
        'color',
        new THREE.BufferAttribute(bullDotColors,3)
    )

    bullDots = new THREE.Points(bullDotsGeometry, pixleMaterial)
        
    bullDots.scale.set(2,2,2)
    
    

    scene.add(bullDots)
    

        


        bullMixer = new THREE.AnimationMixer(bull)
        console.log(gltf)
        bullWalk = bullMixer.clipAction(gltf.animations[0]) 
        bullWalk.timeScale=2.5
        bullWalk.clampWhenFinished=true
        bullWalk.play()

        bull.scale.set(3, 3, 3);
        bull.rotation.y= Math.PI;

        // scene.add(bull);




        bull.traverse((child)=>{
            child.material = selectMaterial
        })


     
        scene.add(bull);
        

    }
)

// gltfLoader.load(
//     '/bird.glb',
//     (gltf) =>
//     {
        
//         bird=gltf.scene
//         console.log(bird);

//         birdMixer = new THREE.AnimationMixer(bird)
//         console.log(gltf)
//         birdFlight = birdMixer.clipAction(gltf.animations[0]) 
//         birdFlight.timeScale=2.5
//         birdFlight.clampWhenFinished=true
//         birdFlight.play()

//         bird.scale.set(2, 2, 2);

//         // scene.add(bull);


//         bird.traverse((child)=>{
//             child.material = selectMaterial
//         })

        
     
//         // scene.add(bird);
        

//     }
// )
gltfLoader.load(
    '/bull.glb',
    (gltf) =>
    {
        bullModel = gltf.scene;
        
    }
)
// gltfLoader.load(
//     '/bird.glb',
//     (gltf) =>
//     {
//         birdModel = gltf.scene;
        
//     }
// )
// gltfLoader.load(
//     '/whale.glb',
//     (gltf) =>
//     {
//         whaleModel = gltf.scene;
        
//     }
// )

const ambientLight = new THREE.AmbientLight('orange', .5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight('#F5F5DC', 2)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = - 7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = - 7
directionalLight.position.set(- 5, 5, 3)
scene.add(directionalLight)

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100)
if(sizes.width>860){
camera.position.set(0, 0, 60)
}
else{
    camera.position.set(0, 0,20)
}


scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setClearColor( 'black',.5);

// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

raycaster.setFromCamera(mouse, camera)
// mask2backup.geometry.attributes.position.needsUpdate = true;
// mask2.geometry.attributes.color.needsUpdate=true;
    

/**
 * Animate
 */

let oldElapsedTime=null;

const clock = new THREE.Clock()
let previousTime = 0
let seconds = 0
const tick = () =>   
{
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - oldElapsedTime
    oldElapsedTime = elapsedTime

    world.step(1 / 60, deltaTime, 3)

// console.log(mouse.x)
    if(bull){



        if(activation=="on"){
        

        for(let i=0; i<bull.children[0].children[4].children[0].geometry.attributes.position.array.length; i++){
            if(bull.children[0].children[4].children[0].geometry.attributes.position.getX(i)>=mouse.x*2.5 ){
                
            bull.children[0].children[4].children[0].geometry.attributes.position.setX(i,mouse.x*2.5+.5)
            }
          
            else{
                bull.children[0].children[4].children[0].geometry.attributes.position.setX(i,bullModel.children[0].children[4].children[0].geometry.attributes.position.getX(i))

            }

        }
        for(let i=0; i<bull.children[0].children[4].children[1].geometry.attributes.position.array.length; i++){
            if(bull.children[0].children[4].children[1].geometry.attributes.position.getX(i)>=mouse.x*2.5 ){
                
            bull.children[0].children[4].children[1].geometry.attributes.position.setX(i,mouse.x*2.5+.5)
            }
          
            else{
                bull.children[0].children[4].children[1].geometry.attributes.position.setX(i,bullModel.children[0].children[4].children[1].geometry.attributes.position.getX(i))

            }

        }
        for(let i=0; i<bull.children[0].children[4].children[2].geometry.attributes.position.array.length; i++){
            if(bull.children[0].children[4].children[2].geometry.attributes.position.getX(i)>=mouse.x*2.5 ){
                
            bull.children[0].children[4].children[2].geometry.attributes.position.setX(i,mouse.x*2.5+.5)
            }
          
            else{
                bull.children[0].children[4].children[2].geometry.attributes.position.setX(i,bullModel.children[0].children[4].children[2].geometry.attributes.position.getX(i))

            }

        }

    




        for(let i=0; i<bull.children[0].children[4].children[0].geometry.attributes.position.array.length; i++){
            if(bull.children[0].children[4].children[0].geometry.attributes.position.getY(i)>=mouse.y*2.5 ){
                
            bull.children[0].children[4].children[0].geometry.attributes.position.setY(i,mouse.y*2.5+.5)
            }
          
            else{
                bull.children[0].children[4].children[0].geometry.attributes.position.setY(i,bullModel.children[0].children[4].children[0].geometry.attributes.position.getY(i))

            }

        }
        for(let i=0; i<bull.children[0].children[4].children[1].geometry.attributes.position.array.length; i++){
            if(bull.children[0].children[4].children[1].geometry.attributes.position.getY(i)>=mouse.y*2.5 ){
                
            bull.children[0].children[4].children[1].geometry.attributes.position.setY(i,mouse.y*2.5+.5)
            }
          
            else{
                bull.children[0].children[4].children[1].geometry.attributes.position.setY(i,bullModel.children[0].children[4].children[1].geometry.attributes.position.getY(i))

            }

        }
        for(let i=0; i<bull.children[0].children[4].children[2].geometry.attributes.position.array.length; i++){
            if(bull.children[0].children[4].children[2].geometry.attributes.position.getY(i)>=mouse.getY*2.5 ){
                
            bull.children[0].children[4].children[2].geometry.attributes.position.setY(i,mouse.y*2.5+.5)
            }
          
            else{
                bull.children[0].children[4].children[2].geometry.attributes.position.setY(i,bullModel.children[0].children[4].children[2].geometry.attributes.position.getY(i))

            }

        }
    }

    else{

        for(let i=0; i<bull.children[0].children[4].children[0].geometry.attributes.position.array.length; i++){
          
          
            
                bull.children[0].children[4].children[0].geometry.attributes.position.setX(i,bullModel.children[0].children[4].children[0].geometry.attributes.position.getX(i))

           

        }
        for(let i=0; i<bull.children[0].children[4].children[1].geometry.attributes.position.array.length; i++){
          
          
           
                bull.children[0].children[4].children[1].geometry.attributes.position.setX(i,bullModel.children[0].children[4].children[1].geometry.attributes.position.getX(i))

            
        }
        for(let i=0; i<bull.children[0].children[4].children[2].geometry.attributes.position.array.length; i++){
           
          
            
                bull.children[0].children[4].children[2].geometry.attributes.position.setX(i,bullModel.children[0].children[4].children[2].geometry.attributes.position.getX(i))

            

        }

    




        for(let i=0; i<bull.children[0].children[4].children[0].geometry.attributes.position.array.length; i++){
          
            
                bull.children[0].children[4].children[0].geometry.attributes.position.setY(i,bullModel.children[0].children[4].children[0].geometry.attributes.position.getY(i))

           

        }
        for(let i=0; i<bull.children[0].children[4].children[1].geometry.attributes.position.array.length; i++){
         
            
                bull.children[0].children[4].children[1].geometry.attributes.position.setY(i,bullModel.children[0].children[4].children[1].geometry.attributes.position.getY(i))

          

        }
        for(let i=0; i<bull.children[0].children[4].children[2].geometry.attributes.position.array.length; i++){
         
          
            
                bull.children[0].children[4].children[2].geometry.attributes.position.setY(i,bullModel.children[0].children[4].children[2].geometry.attributes.position.getY(i))

           

        }


    }


    if(bull && bullDots){

        for(let i=0; i<bullDots.geometry.attributes.position.array.length; i++){
            bullDots.geometry.attributes.position.setX(i, bull.children[0].children[4].children[1].geometry.attributes.position.getX(i))
            bullDots.geometry.attributes.position.setY(i, bull.children[0].children[4].children[1].geometry.attributes.position.getY(i))


        }

    }
     

        bull.children[0].children[4].children[0].geometry.attributes.position.needsUpdate = true;
        bull.children[0].children[4].children[1].geometry.attributes.position.needsUpdate = true;
        bull.children[0].children[4].children[2].geometry.attributes.position.needsUpdate = true;
        bullDots.geometry.attributes.position.needsUpdate = true;




    // }

    // if(bird){
        

    //     for(let i=0; i<bird.children[0].children[3].children[0].geometry.attributes.position.array.length; i++){

    //         if(birdModel.children[0].children[3].children[0].geometry.attributes.position.getZ(i)>0){
                
    //         bird.children[0].children[3].children[0].geometry.attributes.position.setZ(i,1)
    //         }
    //         else{
    //             bird.children[0].children[3].children[0].geometry.attributes.position.setZ(i,.99)

    //         }

    //     }
    //     for(let i=0; i<bird.children[0].children[3].children[1].geometry.attributes.position.array.length; i++){

    //         if(birdModel.children[0].children[3].children[1].geometry.attributes.position.getZ(i)>0){
                
    //         bird.children[0].children[3].children[1].geometry.attributes.position.setZ(i,1)
    //         }
    //         else{
    //             bird.children[0].children[3].children[1].geometry.attributes.position.setZ(i,.98)

    //         }

    //     }
    //     for(let i=0; i<bird.children[0].children[3].children[2].geometry.attributes.position.array.length; i++){

    //         if(birdModel.children[0].children[3].children[2].geometry.attributes.position.getZ(i)>1){
                
    //         bird.children[0].children[3].children[1].geometry.attributes.position.setZ(i,1)
    //         }
    //         else{
    //             bird.children[0].children[3].children[1].geometry.attributes.position.setZ(i,.98)

    //         }

    //     }

    }

  

 



    for(const object of objectsToUpdate)
    {
      
    }

    if(bullMixer)
    {
        bullMixer.update(deltaTime)
    }

    // if(birdMixer)
    // {
    //     birdMixer.update(deltaTime)
    // }

    // if(whaleMixer)
    // {
    //     whaleMixer.update(deltaTime)
    // }


    controls.update()



    
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()