import StarMob from "./utils/starMobUtils"
import { EntityArmorStand, EntityOtherPlayerMP, EntityBat, EntityWither, EntityZombie, EntitySheep, TileEntityChest, S0EPacketSpawnObject, S13PacketDestroyEntities, RenderUtils, ColorUtils, AxisAlignedBB, javaColor, Vec3, starMobRegex, getTrappedChests, isValidEntity, shouldHighlight, shouldHighlightKey, getPhase, inGarden } from "./utils/utils"
import config from "./config"

let starredMobs = new Set()
let markedArmorStands = new Set()
let shadowAssassins = []
let secretBats = []
let witherBoss
let mimic
let mimicChests = []
let witherKeys = []
let bloodKey
let sheeps = []
let pests = []

let starEsp = false
let saEsp = false
let witherEsp = false
let batEsp = false
let mimicEsp = false
let mimicChestEsp = false
let keyEsp = false
let sheepEsp = false
let pestEsp = false

const tickChecker = register("tick", () => {
    
    if (!(config.starEsp || config.witherEsp || config.batEsp || config.mimicEsp || config.mimicChestEsp || config.hideSheep || config.sheepEsp || config.customEsp)) return

    let armorStands = World.getAllEntitiesOfType(EntityArmorStand)
    let otherPlayers = World.getAllEntitiesOfType(EntityOtherPlayerMP)
    // Star Mobs + Shadow Assassin
    if (config.starEsp) {
        markedArmorStands.clear()
        starredMobs.clear()
        
        for (let i = 0; i < armorStands.length; ++i) {
            let armorStand = armorStands[i]
            if (armorStand.getName().includes("✯")) {
                let nearby = World.getWorld().func_72839_b(armorStand.entity, armorStand.entity.func_174813_aQ().func_72317_d(0.0, -1.0, 0.0))
                for (let mob of nearby) {
                    if (isValidEntity(mob)) {
                        let match = armorStand.getName().match(starMobRegex)

                        if (!match) continue

                        let starMob = new StarMob(armorStand)
                        let [_, mobName, sa] = match

                        let height = 1.95

                        if (!sa) {
                            if (mobName.includes("Fels")) {
                                height = 3
                            }
                            else if (mobName.includes("Withermancer")) {
                                height = 2.535
                            } else if (mobName.includes("Zombie") || mobName.includes("Crypt Lurker")) {
                                height = 2.05
                            } else if (mobName.includes("Skeleton") || mobName.includes("Sniper") || mobName.includes("Super Archer")) {
                                height = 2.15
                            }
                        } else {
                            height = -1.95
                        }
                    
                        starMob.height = height

                        markedArmorStands.add(armorStand)
                        starredMobs.add(starMob)
                    }
                }
            }
        }

        let saFound = []
        for (let i = 0; i < otherPlayers.length; ++i) {
            let entity = otherPlayers[i]
            if (!entity.entity.func_82169_q(0)) continue
            if (!entity.entity.func_70694_bm()) continue
            let boots = new Item(entity.entity.func_82169_q(0))
            let bootsNbt = boots?.getNBT()?.toString()
            let heldItem = entity.entity.func_70694_bm().func_82833_r()
            if (heldItem.includes("Silent Death") && bootsNbt.includes("color:6029470")) {
                saFound.push(entity)
            }
        }

        shadowAssassins = saFound
    
        if (markedArmorStands.size) {
            starEsp = true
        } else {
            starEsp = false
        }

        if (shadowAssassins.length) {
            saEsp = true
        } else {
            saEsp = false
        }
    }
    
    // Withers
    if (config.witherEsp || config.goldorTracer) {
        let withers = World.getAllEntitiesOfType(EntityWither)
        
        witherBoss = null

        for (let w of withers) {
            if (w.entity.func_82212_n() != 800 && !w.isInvisible()) {
                if (getPhase() == 4 && w.getRenderY() > 90) continue
                witherBoss = w
            }
        }
        
        if (witherBoss && getPhase() > 0) {
            witherEsp = true
        } else {
            witherEsp = false
        }
    }
    
    // Bats
    if (config.batEsp) {
        let bats = World.getAllEntitiesOfType(EntityBat)
        let batsFound = []
        let hp = [100.0, 200.0, 400.0, 800.0]
        for (let i = 0; i < bats.length; ++i) {
            let bat = bats[i]
            if (hp.includes(bat.entity.func_110138_aP())) {
                batsFound.push(bat)
            }
        }

        secretBats = batsFound

        if (secretBats.length) {
            batEsp = true
        } else {
            batEsp = false
        }
    }

    // Mimic
    if (config.mimicEsp) {
        let mimicFound = null
        for (let i = 0; i < armorStands.length; ++i) {
            let entity = armorStands[i]
            if (entity.getName().includes("Mimic")) {
                mimicFound = entity
            }
        }

        mimic = mimicFound
    
        if (mimic) {
            mimicEsp = true
        } else {
            mimicEsp = false
        }
    }

    // Mimic Chest
    if (config.mimicChestEsp) {
        let mimicChestsFound = []
        let trappedChests = getTrappedChests()
        for (let i = 0; i < trappedChests.length; ++i) {
            mimicChestsFound.push(trappedChests[i])
        }

        mimicChests = mimicChestsFound

        if (mimicChests.length) {
            mimicChestEsp = true
        } else {
            mimicChestEsp = false
        }
    }

    // Keys
    if (config.keyTracer || config.keyEsp) {
        let keysFound = []
        let bloodKeyFound = null
        let entities = World.getAllEntitiesOfType(EntityArmorStand)
        for (let i = 0; i < entities.length; ++i) {
            let entity = entities[i]
            if (entity.getName().includes("Wither Key")) {
                keysFound.push(entity)
            }
            if (entity.getName().includes("Blood Key")) {
                bloodKeyFound = entity
            }
        }

        witherKeys = keysFound
        bloodKey = bloodKeyFound

        if (witherKeys.length || bloodKey) {
            keyEsp = true
        } else {
            keyEsp = false
        }
    }
    
    // Sheep
    if (config.hideSheep || config.highlightSheep) {
        let sheepsFound = []
        let sheepss = World.getAllEntitiesOfType(EntitySheep)
        for (let i = 0; i < sheepss.length; ++i) {
            sheepsFound.push(sheepss[i])
        }

        sheeps = sheepsFound

        if (sheeps.length) {
            sheepEsp = true
            hideSheep.register()
        } else {
            sheepEsp = false
            hideSheep.unregister()
        }
    }



    if (starEsp || saEsp || witherEsp || batEsp || mimicEsp || mimicChestEsp || keyEsp || sheepEsp) {
        espRenderer.register()
    } else {
        espRenderer.unregister()
    }

}).unregister();

const gardenTickChecker = register("tick", () => {

    if (!config.pestEsp || !inGarden()) return;

    // Pests
    if (config.pestEsp) {
        let pestsFound = []
        let armorStands = World.getAllEntitiesOfType(EntityArmorStand)
        for (let i = 0; i < armorStands.length; ++i) {
            let armorStand = armorStands[i]
            let helmet = armorStand.entity.func_82169_q(3)
            if (!helmet) continue
            let helmetName = ChatLib.removeFormatting(new Item(helmet).getName());
            if (helmetName == "Head") {
                pestsFound.push(armorStand)
            }
        }

        pests = pestsFound

        if (pests.length) {
            pestEsp = true
        } else {
            pestEsp = false
        }
    }

    if (pestEsp) {
        espRenderer.register()
    } else {
        espRenderer.unregister()
    }

}).unregister();

register("chat", () => {
    if (config.starEsp || config.witherEsp || config.batEsp || config.mimicEsp || config.mimicChestEsp || config.customEsp) {
        tickChecker.register();
    }
}).setCriteria(/\w+ is now ready!/)

register("chat", () => {
    if (config.pestEsp) {
        gardenTickChecker.register();
    }
}).setCriteria(/.+! \d ൠ Pest have spawned in Plot - .+!/)

function makeColor(configColor) {
    let r = configColor.getRed()
    let g = configColor.getGreen()
    let b = configColor.getBlue()
    let a = configColor.getAlpha()
    return new ColorUtils(javaColor.RGBtoHSB(r, g, b, null), 255 * a)
}

const espRenderer = register("renderWorld", () => {

    let phase = config.mode == 0

    // STAR MOBS

    if (starEsp || saEsp) {
        let starOutlineColor = makeColor(config.starOutline)
        let starFillColor = makeColor(config.starFill)
        let minibossOutlineColor = makeColor(config.minibossOutline)
        let minibossFillColor = makeColor(config.minibossFill)
        let saOutlineColor = makeColor(config.saOutline)
        let saFillColor = makeColor(config.saFill)
        let felsOutlineColor = makeColor(config.felsOutline)
        let felsFillColor = makeColor(config.felsFill)
        let tankyOutlineColor = makeColor(config.tankyOutline)
        let tankyFillColor = makeColor(config.tankyFill)

        if (starEsp) {
            for (let mob of starredMobs) {
                let outlineColor = starOutlineColor
                let fillColor = starFillColor
                let outlineWidth = config.starOutlineWidth
                if (config.detailed) {
                    switch (mob.mobType) {
                        case 1: 
                            outlineColor = minibossOutlineColor
                            fillColor = minibossFillColor
                            outlineWidth = config.minibossOutlineWidth
                            break
                        case 2: 
                            outlineColor = felsOutlineColor
                            fillColor = felsFillColor
                            outlineWidth = config.felsOutlineWidth
                            break
                        case 3: 
                            outlineColor = tankyOutlineColor
                            fillColor = tankyFillColor
                            outlineWidth = config.tankyOutlineWidth
                            break
                    }
                }
                let [x, y, z] = [mob.entity.getRenderX(), mob.entity.getRenderY() - mob.height, mob.entity.getRenderZ()]
                let w = 0.6
                let h = mob.height
                let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
                if (shouldHighlight(mob.entity, w, h)) {
                    RenderUtils.INSTANCE.drawFilledAABB(newBox, fillColor, phase)
                    RenderUtils.INSTANCE.drawOutlinedAABB(newBox, outlineColor, outlineWidth, phase, true)
                }
            }
        }
    
        if (saEsp) {
            for (let i = 0; i < shadowAssassins.length; ++i) {
                let outlineColor = starOutlineColor
                let fillColor = starFillColor
                let outlineWidth = config.starOutlineWidth
                if (config.detailed) {
                    outlineColor = saOutlineColor
                    fillColor = saFillColor
                    outlineWidth = config.saOutlineWidth
                }
                let sa = shadowAssassins[i]
                let [x, y, z] = [sa.getRenderX(), sa.getRenderY(), sa.getRenderZ()]
                let w = 0.6
                let h = 1.95
                let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
                if (shouldHighlight(sa, w, h)) {
                    RenderUtils.INSTANCE.drawFilledAABB(newBox, fillColor, phase)
                    RenderUtils.INSTANCE.drawOutlinedAABB(newBox, outlineColor, outlineWidth, phase, true)
                }
            }
        }
    }

    // WITHERS

    if (witherEsp) {
        const witherOutlineWidth = config.witherOutlineWidth
        const witherWidth = config.witherEspWidth
        const goldorTracerWidth = config.goldorTracerWidth

        let outlineColor = makeColor(config.witherOutline)
        let fillColor = makeColor(config.witherFill)
        let tracerColor = makeColor(config.goldorTracerColor)

        const playerY = Player.getRenderY() + (Player.isSneaking() ? 1.54 : 1.62)
        
        if (!witherBoss) return
        let [x, y, z] = [witherBoss.getRenderX(), witherBoss.getRenderY(), witherBoss.getRenderZ()]
        if (getPhase() == 1) {
            let w = witherWidth
            let h = 3.1
            let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
            if (shouldHighlight(witherBoss, w, h)) {
                RenderUtils.INSTANCE.drawFilledAABB(newBox, fillColor, phase)
                RenderUtils.INSTANCE.drawOutlinedAABB(newBox, outlineColor, witherOutlineWidth, phase, true)
            }
        } else {
            let w = witherWidth
            let h = 3.7
            let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
            if (shouldHighlight(witherBoss, w, h)) {
                RenderUtils.INSTANCE.drawFilledAABB(newBox, fillColor, phase)
                RenderUtils.INSTANCE.drawOutlinedAABB(newBox, outlineColor, witherOutlineWidth, phase, true)
            }
        }
    
        if (config.goldorTracer && getPhase() == 3 && config.mode == 2) {
            let vec1 = new Vec3(Player.getRenderX(), playerY, Player.getRenderZ())
            let vec2 = new Vec3(x, y, z)
            let points = new ArrayList()
            points.add(vec1)
            points.add(vec2)
            RenderUtils.INSTANCE.drawLines(points, tracerColor, goldorTracerWidth, true)
        }
    }

    // BATS

    if (batEsp) {
        const batOutlineWidth = config.batOutlineWidth

        let outlineColor = makeColor(config.batOutline)
        let fillColor = makeColor(config.batFill)
    
        for (let i = 0; i < secretBats.length; ++i) {
            let bat = secretBats[i]
            let [x, y, z] = [bat.getRenderX(), bat.getRenderY(), bat.getRenderZ()]
            let w = 0.6
            let h = 0.9
            let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
            if (shouldHighlight(bat, w, h)) {
                RenderUtils.INSTANCE.drawFilledAABB(newBox, fillColor, phase)
                RenderUtils.INSTANCE.drawOutlinedAABB(newBox, outlineColor, batOutlineWidth, phase, true)
            }
        }
    }

    // MIMICS

    if (mimicEsp || mimicChestEsp) {
        const mimicOutlineWidth = config.mimicOutlineWidth

        let outlineColor = makeColor(config.mimicOutline)
        let fillColor = makeColor(config.mimicFill)

        if (mimicEsp) {
            let [x, y, z] = [mimic.getRenderX(), mimic.getRenderY() - 1, mimic.getRenderZ()]
            let w = 0.6
            let h = 1.3
            let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
            if (shouldHighlight(mimic, w, h)) {
                RenderUtils.INSTANCE.drawFilledAABB(newBox, fillColor, phase)
                RenderUtils.INSTANCE.drawOutlinedAABB(newBox, outlineColor, mimicOutlineWidth, phase, true)
            }
        }

        if (mimicChestEsp) {
            for (let i = 0; i < mimicChests.length; ++i) {
                let mimicChest = mimicChests[i]
                let [x, y, z] = [mimicChest[0] + 0.5, mimicChest[1], mimicChest[2] + 0.5]
                let w = 0.9
                let h = 0.9
                let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
                RenderUtils.INSTANCE.drawFilledAABB(newBox, fillColor, config.mode < 2)
                RenderUtils.INSTANCE.drawOutlinedAABB(newBox, outlineColor, mimicOutlineWidth, config.mode < 2, true)
            }
        }
    }

    // KEYS

    if (keyEsp) {
        const keyOutlineWidth = config.keyOutlineWidth
        const keyTracerWidth = config.keyTracerWidth

        let witherOutlineColor = makeColor(config.witherKeyOutline)
        let witherFillColor = makeColor(config.witherKeyFill)
        let bloodOutlineColor = makeColor(config.bloodKeyOutline)
        let bloodFillColor = makeColor(config.bloodKeyFill)
        let witherTracerColor = makeColor(config.witherKeyTracerColor)
        let bloodTracerColor = makeColor(config.bloodKeyTracerColor)

        const playerY = Player.getRenderY() + (Player.isSneaking() ? 1.54 : 1.62)
    
        for (let i = 0; i < witherKeys.length; ++i) {
            let witherKey = witherKeys[i]
            let [x, y, z] = [witherKey.getRenderX(), witherKey.getRenderY() + 1.15, witherKey.getRenderZ()]
    
            if (config.keyEsp) {
                let w = 1
                let h = 1
                let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
                if (shouldHighlightKey(witherKey)) {
                    RenderUtils.INSTANCE.drawFilledAABB(newBox, witherFillColor, phase)
                    RenderUtils.INSTANCE.drawOutlinedAABB(newBox, witherOutlineColor, keyOutlineWidth, phase, true)
                }
            }
    
            if (config.keyTracer && config.mode == 2) {
                let vec1 = new Vec3(Player.getRenderX(), playerY, Player.getRenderZ())
                let vec2 = new Vec3(x, y, z)
                let points = new ArrayList()
                points.add(vec1)
                points.add(vec2)
                RenderUtils.INSTANCE.drawLines(points, witherTracerColor, keyTracerWidth, true)
            }
        }

        if (bloodKey) {
            let [x, y, z] = [bloodKey.getRenderX(), bloodKey.getRenderY() + 1.15, bloodKey.getRenderZ()]
    
            if (config.keyEsp) {
                let w = 1
                let h = 1
                let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
                if (shouldHighlightKey(bloodKey)) {
                    RenderUtils.INSTANCE.drawFilledAABB(newBox, bloodFillColor, phase)
                    RenderUtils.INSTANCE.drawOutlinedAABB(newBox, bloodOutlineColor, keyOutlineWidth, phase, true)
                }
            }
            
            if (config.keyTracer && config.mode == 2) {
                let vec1 = new Vec3(Player.getRenderX(), playerY, Player.getRenderZ())
                let vec2 = new Vec3(x, y, z)
                let points = new ArrayList()
                points.add(vec1)
                points.add(vec2)
                RenderUtils.INSTANCE.drawLines(points, bloodTracerColor, keyTracerWidth, true)
            }
        }
    }

    // SHEEP

    if (sheepEsp) {
        const sheepOutlineWidth = config.sheepOutlineWidth

        let outlineColor = makeColor(config.sheepOutline)
        let fillColor = makeColor(config.sheepFill)
    
        for (let i = 0; i < sheeps.length; ++i) {
            let sheep = sheeps[i]
            let [x, y, z] = [sheep.getRenderX(), sheep.getRenderY(), sheep.getRenderZ()]
            let w = 1.5
            let h = 1.5
            let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
            if (shouldHighlight(sheep, w, h)) {
                RenderUtils.INSTANCE.drawFilledAABB(newBox, fillColor, phase)
                RenderUtils.INSTANCE.drawOutlinedAABB(newBox, outlineColor, sheepOutlineWidth, phase, true)
            }
        }
    }

    // PESTS

    if (pestEsp) {
        const pestOutlineWidth = config.pestOutlineWidth
        const pestTracerWidth = config.pestTracerWidth

        let outlineColor = makeColor(config.sheepOutline)
        let fillColor = makeColor(config.sheepFill)
        let tracerColor = makeColor(config.pestTracerColor)

        const playerY = Player.getRenderY() + (Player.isSneaking() ? 1.54 : 1.62)
    
        for (let i = 0; i < pests.length; ++i) {
            let pest = pests[i]
            let [x, y, z] = [pest.getRenderX(), pest.getRenderY() + 1.2, pest.getRenderZ()]
            let w = 0.8
            let h = 0.8
            let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
            if (shouldHighlight(pest, 1, 1)) {
                RenderUtils.INSTANCE.drawFilledAABB(newBox, fillColor, phase)
                RenderUtils.INSTANCE.drawOutlinedAABB(newBox, outlineColor, pestOutlineWidth, phase, true)
            }

            if (config.pestTracer && config.mode == 2) {
                let vec1 = new Vec3(Player.getRenderX(), playerY, Player.getRenderZ())
                let vec2 = new Vec3(x, y, z)
                let points = new ArrayList()
                points.add(vec1)
                points.add(vec2)
                RenderUtils.INSTANCE.drawLines(points, tracerColor, pestTracerWidth, true)
            }
        }
    }

}).unregister()

const hideSheep = register("renderEntity", (entity, pos, pt, event) => {
    if (!config.hideSheep) return
    if (entity.getEntity() instanceof EntitySheep) {
        cancel(event)
    }
}).unregister()

register("worldUnload", () => {
    starredMobs.clear();
    markedArmorStands.clear();
    shadowAssassins = [];
    witherBoss = null;
    secretBats = [];
    mimic = null;
    mimicChests = [];
    witherKeys = [];
    bloodKey = null;
    sheeps = [];
    pests = [];
    tickChecker.unregister();
    gardenTickChecker.unregister();
    espRenderer.unregister();
})

register("command", () => {
    return config.openGUI()
}).setName("savage").setAliases(["esp", "se"])