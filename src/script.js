import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { LoopOnce, SphereGeometry, TextureLoader } from 'three'
import CANNON, { Sphere } from 'cannon'
import $ from "./Jquery"


let selectedObject
let selectedModel

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
const selectMaterial2 = new THREE.MeshStandardMaterial({color:'blue'})





let bull
let bullMixer
let bullWalk
let bullModel
let bullDots
let bullDots2

let bird
let birdMixer
let birdFlight
let birdModel
let currentObject

let whale
let whaleMixer
let whaleSwim
let whaleModel
let activation = "off"
let activation2 = "off"
let activation3 = "off"
let activation4 = "off"
let activation5 = "on"

$(".button").click((e)=>{
    e.stopPropagation()
    e.preventDefault();
    let picked = e.target;
    let id = $(picked).attr("id")
    switch(id){
    case "whaleButton":
        if(whale){
            selectedObject = whale.children[0].children[4].children;
            selectedModel = whaleModel.children[0].children[4].children;
            console.log(selectedModel)
            console.log(selectedObject)
            scene.add(whale)
            if(bull){
                scene.remove(bull)
            }
            if(bird){
                scene.remove(bird)
            }

        }
        break
       

    case "bullButton":
        if(bull){
            selectedObject = bull.children[0].children[4].children;
            selectedModel = bullModel.children[0].children[4].children;
            scene.add(bull)
            if(whale){
                scene.remove(whale)
            }
            if(bird){
                scene.remove(bird)
            }

        }
        break
    
    case "birdButton":
        if(bird){
            scene.add(bird)
            selectedObject = bird.children[0].children[3].children;
            selectedModel = birdModel.children[0].children[3].children;
            console.log(selectedModel)
            console.log(selectedObject)

            if(bull){
                scene.remove(bull)
            }
            if(whale){
                scene.remove(whale)
            }

        }

    
    }
    
    })

$('body').keydown(()=>{
if(activation=="off"&&activation5=="on"){
    activation = "on"
    activation2 = "off"
    activation3 = "off"
    activation4 = "off"
    activation5 = "off"
}
else if (activation=="on"&&activation2=="off"){
    activation ="off";
    activation2="on";
    activation3="off"
    activation4 = "off"
    activation5 = "off"

}
else if (activation2 == "on"&&activation3=="off"){
    activation ="off";
    activation2="off";
    activation3="on"
    activation4 ="off"
    activation5 = "off"

    
}
else if (activation3 == "on"&&activation4=="off"){
    activation ="off";
    activation2="off";
    activation3="off";
    activation4="on"
    activation5 = "off"
    
}
else if (activation4 == "on" &&activation5=="off"){
    activation ="off";
    activation2="off";
    activation3="off";
    activation4="off"
    activation5 = "on"
    
}
})
// setInterval(() => {
//     if(activation=="off"){
//         activation="on"
//     }
//     setTimeout(() => {
//         activation="off"
        
//     }, 100);
// }, 200);




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

        bull.children[0].quaternion.set(0,0,0)
        bull.children[0].rotation.set(0,0,0)
        // bull.children[0].up.set(0,0,0)




        


        bullMixer = new THREE.AnimationMixer(bull)
        bullWalk = bullMixer.clipAction(gltf.animations[0]) 
        bullWalk.timeScale=2.5
        bullWalk.clampWhenFinished=true
        bullWalk.play()

        bull.scale.set(3, 3, 3);
        bull.rotation.y= Math.PI;
        bull.rotation.x= Math.PI*.43;


        // scene.add(bull);




        bull.traverse((child)=>{
            child.material = selectMaterial
            
        })
        bull.children[0].children[4].children[1].material = selectMaterial2


        selectedObject = bull.children[0].children[4].children;
        scene.add(bull);
        

    }
)

gltfLoader.load(
    '/bird.glb',
    (gltf) =>
    {
        
        bird=gltf.scene
        console.log(bird);

        birdMixer = new THREE.AnimationMixer(bird)
       
        birdFlight = birdMixer.clipAction(gltf.animations[0]) 
        birdFlight.timeScale=2.5
        birdFlight.clampWhenFinished=true
        birdFlight.play()

        bird.scale.set(2, 2, 2);

        // scene.add(bull);


        bird.traverse((child)=>{
            child.material = selectMaterial
        })

        
     
        // scene.add(bird);
        

    }
)


gltfLoader.load(
    '/whale.glb',
    (gltf) =>
    {
        
        whale=gltf.scene
        console.log(whale);

        whaleMixer = new THREE.AnimationMixer(whale)
        console.log(gltf)
        whaleSwim = whaleMixer.clipAction(gltf.animations[0]) 
        whaleSwim.timeScale=2.5
        whaleSwim.clampWhenFinished=true
        whaleSwim.play()

        whale.scale.set(3, 3, 3);

        // scene.add(bull);


        whale.traverse((child)=>{
            child.material = selectMaterial
        })

        
     
        // scene.add(bird);
        

    }
)

gltfLoader.load(
    '/bull.glb',
    (gltf) =>
    {
        bullModel = gltf.scene;
        selectedModel = bullModel.children[0].children[4].children;

        
    }
)

gltfLoader.load(
    '/bull.glb',
    (gltf) =>
    {
        let bull = gltf.scene;

        console.log(bull)
        
        let bullDotCoordinates = bull.children[0].children[4].children[1].geometry.attributes.position.array;

        let bullDotCoordinates2 = bull.children[0].children[4].children[0].geometry.attributes.position.array;

        

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
    let pixleMaterial2 = new THREE.PointsMaterial({
        color:"blue",
        size:.3,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
    })

    let bullDotsGeometry2 = new THREE.BufferGeometry;
        
    bullDotsGeometry2.setAttribute(
        'position',
        new THREE.BufferAttribute(bullDotCoordinates2,3)
    )
    bullDotsGeometry2.setAttribute(
        'color',
        new THREE.BufferAttribute(bullDotColors,3)
    )

    bullDots2 = new THREE.Points(bullDotsGeometry2, pixleMaterial2)
        
    bullDots2.scale.set(3,3,3)
    bullDots2.rotation.set(0, Math.PI, 0)

    // scene.add(bullDots2)


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
        
    bullDots.scale.set(3,3,3)
    bullDots.rotation.set(Math.PI*.43, Math.PI, 0)
    bullDots.position.set(0,13,-3.9)
    
    

        scene.add(bullDots)

    


        
    }
)
gltfLoader.load(
    '/bird.glb',
    (gltf) =>
    {
        birdModel = gltf.scene;
        
    }
)
gltfLoader.load(
    '/whale.glb',
    (gltf) =>
    {
        whaleModel = gltf.scene;
        
    }
)

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
    

//function for mousemove

function followMouseX(objects, model){

     for(let i = 0; i<objects.length; i++){

        for(let j=0; j<objects[i].geometry.attributes.position.array.length; j++){
            if(objects[i].geometry.attributes.position.getX(j)>=mouse.x*2 ){
                objects[i].geometry.attributes.position.setX(j,mouse.x*2+.2)
            }
          
            else{
                objects[i].geometry.attributes.position.setX(j,model[i].geometry.attributes.position.getX(j))
        
            }     
       
        };
    }
}

function followMouseY(objects, model){
    console.log("followY function")
    for(let i = 0; i<objects.length; i++){
        for(let j=0; j<objects[i].geometry.attributes.position.array.length; j++){


             
            if(objects[i].geometry.attributes.position.getY(j)>=mouse.y*2 ){
        
                objects[i].geometry.attributes.position.setY(j,mouse.y*2+.2)
            
            }
  
            else{

                objects[i].geometry.attributes.position.setY(j,model[i].geometry.attributes.position.getY(j))

            }

    }
}
}

function followMouseZ(objects, model){
    console.log("followZ function")
    for(let i = 0; i<objects.length; i++){
        for(let j=0; j<objects[i].geometry.attributes.position.array.length; j++){


             
            if(objects[i].geometry.attributes.position.getZ(j)>=mouse.x*2 ){
        
                objects[i].geometry.attributes.position.setZ(j,mouse.x*2+.2)
            
            }
  
            else{

                objects[i].geometry.attributes.position.setZ(j,model[i].geometry.attributes.position.getZ(j))

            }

    }
}   
}

function returnToNormal(objects, model){

    for(let i = 0; i<objects.length; i++){
        for(let j=0; j<objects[i].geometry.attributes.position.array.length; j++){


             
          

                objects[i].geometry.attributes.position.setX(j,model[i].geometry.attributes.position.getX(j))
                objects[i].geometry.attributes.position.setY(j,model[i].geometry.attributes.position.getY(j))

                objects[i].geometry.attributes.position.setZ(j,model[i].geometry.attributes.position.getZ(j))


            

    }
}  



}

var transformedSkinVertex = function (skin, index) {
    var skinIndices = (new THREE.Vector4 ()).fromBufferAttribute (skin.geometry.getAttribute ('skinIndex'), index);
    var skinWeights = (new THREE.Vector4 ()).fromBufferAttribute (skin.geometry.getAttribute ('skinWeight'), index);
    var skinVertex = (new THREE.Vector3 ()).fromBufferAttribute (skin.geometry.getAttribute ('position'), index).applyMatrix4 (skin.bindMatrix);
    var result = new THREE.Vector3 ()
    var temp = new THREE.Vector3 ()
     var tempMatrix = new THREE.Matrix4 ()
     var properties = ['x', 'y', 'z', 'w'];
    for (var i = 0; i < 4; i++) {
        var boneIndex = skinIndices[properties[i]];
        // console.log(boneIndex)
        tempMatrix.multiplyMatrices (skin.skeleton.bones[boneIndex].matrixWorld, skin.skeleton.boneInverses[boneIndex]);
        result.add (temp.copy (skinVertex).applyMatrix4 (tempMatrix).multiplyScalar (skinWeights[properties[i]]));
    }
    return result.applyMatrix4 (skin.bindMatrixInverse);
};



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
    if(bull&&whale&&bird){



        if(activation=="on"){


            followMouseX(selectedObject, selectedModel )

        }

        else if(activation2=="on"){

            followMouseY(selectedObject, selectedModel)


        }

        else if(activation3=="on"){

            followMouseZ(selectedObject, selectedModel )


        }

        else if(activation5 =="on"){
            returnToNormal(selectedObject, selectedModel )

    }

        
        

    if(bull && bullDots &&bullDots2){

        for(let i=0; i<bullDots.geometry.attributes.position.array.length/3; i++){
            let vert = transformedSkinVertex(bull.children[0].children[4].children[1], i)
            bullDots.geometry.attributes.position.setY(i,vert.y)
            bullDots.geometry.attributes.position.setX(i,vert.x)
            bullDots.geometry.attributes.position.setZ(i,vert.z)


        //     bullDots.geometry.attributes.skinIndex
        //     if(  bullDots.geometry.attributes.position.getZ(i)<bullModel.children[0].children[4].children[0].geometry.attributes.position.getZ(i)+12){

        //         bullDots.geometry.attributes.position.setZ(i,bullDots.geometry.attributes.position.getZ(i)+.1)
        //         bullDots.geometry.attributes.position.setY(i,bullDots.geometry.attributes.position.getY(i)+.05
        //         )

 
        // }
        // else{
        //     bullDots.geometry.attributes.position.setZ(i, bullModel.children[0].children[4].children[1].geometry.attributes.position.getZ(i))
        //     bullDots.geometry.attributes.position.setY(i, bullModel.children[0].children[4].children[1].geometry.attributes.position.getY(i))

        // }

    }

    // for(let i=0; i<100; i++){
    //     if(  bullDots2.geometry.attributes.position.getZ(i)<bullModel.children[0].children[4].children[1].geometry.attributes.position.getZ(i)+12){

    //         bullDots2.geometry.attributes.position.setZ(i,bullDots2.geometry.attributes.position.getZ(i)+.1)

    // }
    // else{
    //     bullDots2.geometry.attributes.position.setZ(i, bullModel.children[0].children[4].children[0].geometry.attributes.position.getZ(i))
    // }

// }
     

        bull.children[0].children[4].children[0].geometry.attributes.position.needsUpdate = true;
        bull.children[0].children[4].children[1].geometry.attributes.position.needsUpdate = true;
        bull.children[0].children[4].children[2].geometry.attributes.position.needsUpdate = true;
        whale.children[0].children[4].children[0].geometry.attributes.position.needsUpdate = true;
        whale.children[0].children[4].children[1].geometry.attributes.position.needsUpdate = true;
        whale.children[0].children[4].children[2].geometry.attributes.position.needsUpdate = true;
        bird.children[0].children[3].children[0].geometry.attributes.position.needsUpdate = true;
        bird.children[0].children[3].children[1].geometry.attributes.position.needsUpdate = true;
        bird.children[0].children[3].children[2].geometry.attributes.position.needsUpdate = true;

        bullDots.geometry.attributes.position.needsUpdate = true;
        bullDots2.geometry.attributes.position.needsUpdate = true;

        



    }

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

    if(birdMixer)
    {
        birdMixer.update(deltaTime)
    }

    if(whaleMixer)
    {
        whaleMixer.update(deltaTime)
    }


    controls.update()



    
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()