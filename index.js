import Dungeon from "../BloomCore/dungeons/Dungeon"
import StarMob from "./utils/utils"
import { getTrappedChests, EntityArmorStand, EntityOtherPlayerMP, EntityWither, EntityBat, EntitySheep, S0EPacketSpawnObject, S13PacketDestroyEntities } from "./utils/utils"
import config from "./config"

const RenderUtils = Java.type("me.odinmain.utils.render.RenderUtils");
const ColorUtils = Java.type("me.odinmain.utils.render.Color");
const AxisAlignedBB = Java.type("net.minecraft.util.AxisAlignedBB");
const javaColor = Java.type("java.awt.Color")
const Vec3 = Java.type("net.minecraft.util.Vec3")

const starMobRegex = /§6✯ (?:§.)*(.+)§r.+§c❤$|^(Shadow Assassin)$/

let witherPhase = 0

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

function isValidEntity(entity) {
    if (!entity) return false
    else if (entity instanceof EntityArmorStand) return false
    else if (entity instanceof EntityWither) return false
    else if (entity == Player.getPlayer()) return false
    else return true
}

function shouldHighlight(entity) {
    if (config.mode == 1) return true
    let eyePos = Player.getPlayer().func_174824_e(0);
    let vecs = []
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            for (let k = 0; k < 3; ++k) {
                vecs.push(new Vec3(entity.getRenderX() - 0.5 + i / 2, entity.getRenderY() + j, entity.getRenderZ() - 0.5 + k / 2))
            }
        }
    }

    for (let v of vecs) {
        if (World.getWorld().func_147447_a(eyePos, v, false, false, false) == null) return true
    }
    return false
}

function shouldHighlightArmorStand(entity) {
    if (config.mode == 1) return true
    let eyePos = Player.getPlayer().func_174824_e(0);
    let vecs = []
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            for (let k = 0; k < 3; ++k) {
                vecs.push(new Vec3(entity.getRenderX() - 0.5 + i / 2, entity.getRenderY() + j, entity.getRenderZ() - 0.5 + k / 2))
            }
        }
    }

    for (let v of vecs) {
        if (World.getWorld().func_147447_a(eyePos, v, false, false, false) == null) return true
    }
    return false
}

function shouldHighlightKey(entity) {
    if (config.mode == 1) return true
    let eyePos = Player.getPlayer().func_174824_e(0);
    let vecs = []
    for (let i = 0; i < 3; ++i) {
        for (let j = 0; j < 3; ++j) {
            for (let k = 0; k < 3; ++k) {
                vecs.push(new Vec3(entity.getRenderX() - 0.5 + i / 2, entity.getRenderY() + 1.15 + j / 2, entity.getRenderZ() - 0.5 + k / 2))
            }
        }
    }

    for (let v of vecs) {
        if (World.getWorld().func_147447_a(eyePos, v, false, false, false) == null) return true
    }
    return false
}

register("chat", (message) => {
    if (!config.witherEsp) return
    if (message == "[BOSS] Maxor: WELL! WELL! WELL! LOOK WHO'S HERE!") {
        witherPhase = 1
    }
    if (message == "[BOSS] Storm: Pathetic Maxor, just like expected.") {
        witherPhase = 2
    }
    if (message == "The Core entrance is opening!") {
        witherPhase = 3
    }
    if (message == "[BOSS] Necron: You went further than any human before, congratulations.") {
        witherPhase = 4
    }
    if (message == "[BOSS] Necron: All this, for nothing...") {
        witherPhase = 0
    }
}).setCriteria("${message}")

register("command", () => {
    ChatLib.chat(Dungeon.inDungeon)
}).setName("asdf")

const tickChecker = register("tick", () => {
    
    if (!(config.starEsp || config.witherEsp || config.batEsp || config.mimicEsp || config.mimicChestEsp || config.hideSheep || config.sheepEsp || config.customEsp) || !Dungeon.inDungeon) return

    // Star Mobs + Shadow Assassin
    if (config.starEsp) {
        markedArmorStands.clear()
        starredMobs.clear()
        let armorStands = World.getAllEntitiesOfType(EntityArmorStand)
    
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
        let entities = World.getAllEntitiesOfType(EntityOtherPlayerMP)
        for (let i = 0; i < entities.length; ++i) {
            let entity = entities[i]
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
        let withers = []
        withers = World.getAllEntitiesOfType(EntityWither)

        witherBoss = null

        for (let w of withers) {
            if (w.entity.func_82212_n() != 800 && !w.isInvisible()) {
                if (witherPhase == 4 && w.getRenderY() > 90) continue
                witherBoss = w
            }
        }
        
        if (witherBoss && witherPhase > 0) {
            witherEsp = true
        } else {
            witherEsp = false
        }
    }
    
    // Bats
    if (config.batEsp) {
        let batsFound = []
        let bats = World.getAllEntitiesOfType(EntityBat)
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
        let entities = World.getAllEntitiesOfType(EntityArmorStand)
        for (let i = 0; i < entities.length; ++i) {
            let entity = entities[i]
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

})

function inGarden() {
    let index = TabList?.getNames()?.findIndex(line => line?.removeFormatting()?.toLowerCase()?.includes("area: garden"))
    if (index > -1) return true;
    return false;
}

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

})

if (config.starEsp || config.witherEsp || config.batEsp || config.mimicEsp || config.mimicChestEsp || config.customEsp) {
    tickChecker.register()
}

if (config.pestEsp) {
    gardenTickChecker.register()
}

const espRenderer = register("renderWorld", () => {

    let phase = false

    // STAR MOBS

    if (starEsp || saEsp) {
        const starOutlineColor = config.starOutline
        const starFillColor = config.starFill
        const starOutlineWidth = config.starOutlineWidth

        let r1 = starOutlineColor.getRed()
        let g1 = starOutlineColor.getGreen()
        let b1 = starOutlineColor.getBlue()
        let a1 = starOutlineColor.getAlpha()
        let outlineColor = new ColorUtils(javaColor.RGBtoHSB(r1, g1, b1, null), 255 * a1)

        let r2 = starFillColor.getRed()
        let g2 = starFillColor.getGreen()
        let b2 = starFillColor.getBlue()
        let a2 = starFillColor.getAlpha()
        let fillColor = new ColorUtils(javaColor.RGBtoHSB(r2, g2, b2, null), 255 * a2)
        
        if (starEsp) {
            for (let mob of starredMobs) {
                let [x, y, z] = [mob.entity.getRenderX(), mob.entity.getRenderY() - mob.height, mob.entity.getRenderZ()]
                let w = 0.6
                let h = mob.height
                let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
                if (shouldHighlightArmorStand(mob.entity)) {
                    RenderUtils.INSTANCE.drawFilledAABB(newBox, fillColor, phase)
                    RenderUtils.INSTANCE.drawOutlinedAABB(newBox, outlineColor, starOutlineWidth, phase, true)
                }
            }
        }
    
        if (saEsp) {
            for (let i = 0; i < shadowAssassins.length; ++i) {
                let sa = shadowAssassins[i]
                let [x, y, z] = [sa.getRenderX(), sa.getRenderY(), sa.getRenderZ()]
                let w = 0.6
                let h = 1.95
                let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
                if (shouldHighlight(sa)) {
                    RenderUtils.INSTANCE.drawFilledAABB(newBox, fillColor, phase)
                    RenderUtils.INSTANCE.drawOutlinedAABB(newBox, outlineColor, starOutlineWidth, phase, true)
                }
            }
        }
    }

    // WITHERS

    if (witherEsp) {
        const witherOutlineColor = config.witherOutline
        const witherFillColor = config.witherFill
        const witherOutlineWidth = config.witherOutlineWidth
        const witherWidth = config.witherEspWidth
        const goldorTracerColor = config.goldorTracerColor
        const goldorTracerWidth = config.goldorTracerWidth

        let r1 = witherOutlineColor.getRed()
        let g1 = witherOutlineColor.getGreen()
        let b1 = witherOutlineColor.getBlue()
        let a1 = witherOutlineColor.getAlpha()
        let outlineColor = new ColorUtils(javaColor.RGBtoHSB(r1, g1, b1, null), 255 * a1)

        let r2 = witherFillColor.getRed()
        let g2 = witherFillColor.getGreen()
        let b2 = witherFillColor.getBlue()
        let a2 = witherFillColor.getAlpha()
        let fillColor = new ColorUtils(javaColor.RGBtoHSB(r2, g2, b2, null), 255 * a2)

        let r3 = goldorTracerColor.getRed()
        let g3 = goldorTracerColor.getGreen()
        let b3 = goldorTracerColor.getBlue()
        let a3 = goldorTracerColor.getAlpha()
        let tracerColor = new ColorUtils(javaColor.RGBtoHSB(r3, g3, b3, null), 255 * a3)

        const playerY = Player.getRenderY() + (Player.isSneaking() ? 1.54 : 1.62)
        
        if (!witherBoss) return
        let [x, y, z] = [witherBoss.getRenderX(), witherBoss.getRenderY(), witherBoss.getRenderZ()]
        if (witherPhase == 1) {
            let w = witherWidth
            let h = 3.1
            let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
            if (shouldHighlight(witherBoss)) {
                RenderUtils.INSTANCE.drawFilledAABB(newBox, fillColor, phase)
                RenderUtils.INSTANCE.drawOutlinedAABB(newBox, outlineColor, witherOutlineWidth, phase, true)
            }
        } else {
            let w = witherWidth
            let h = 3.7
            let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
            if (shouldHighlight(witherBoss)) {
                RenderUtils.INSTANCE.drawFilledAABB(newBox, fillColor, phase)
                RenderUtils.INSTANCE.drawOutlinedAABB(newBox, outlineColor, witherOutlineWidth, phase, true)
            }
        }
    
        if (config.goldorTracer && witherPhase == 3 && config.mode == 1) {
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
        const batOutlineColor = config.batOutline
        const batFillColor = config.batFill
        const batOutlineWidth = config.batOutlineWidth

        let r1 = batOutlineColor.getRed()
        let g1 = batOutlineColor.getGreen()
        let b1 = batOutlineColor.getBlue()
        let a1 = batOutlineColor.getAlpha()
        let outlineColor = new ColorUtils(javaColor.RGBtoHSB(r1, g1, b1, null), 255 * a1)

        let r2 = batFillColor.getRed()
        let g2 = batFillColor.getGreen()
        let b2 = batFillColor.getBlue()
        let a2 = batFillColor.getAlpha()
        let fillColor = new ColorUtils(javaColor.RGBtoHSB(r2, g2, b2, null), 255 * a2)
    
        for (let i = 0; i < secretBats.length; ++i) {
            let bat = secretBats[i]
            let [x, y, z] = [bat.getRenderX(), bat.getRenderY(), bat.getRenderZ()]
            let w = 0.6
            let h = 0.9
            let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
            if (shouldHighlight(bat)) {
                RenderUtils.INSTANCE.drawFilledAABB(newBox, fillColor, phase)
                RenderUtils.INSTANCE.drawOutlinedAABB(newBox, outlineColor, batOutlineWidth, phase, true)
            }
        }
    }

    // MIMICS

    if (mimicEsp || mimicChestEsp) {
        const mimicOutlineColor = config.mimicOutline
        const mimicFillColor = config.mimicFill
        const mimicOutlineWidth = config.mimicOutlineWidth

        let r1 = mimicOutlineColor.getRed()
        let g1 = mimicOutlineColor.getGreen()
        let b1 = mimicOutlineColor.getBlue()
        let a1 = mimicOutlineColor.getAlpha()
        let outlineColor = new ColorUtils(javaColor.RGBtoHSB(r1, g1, b1, null), 255 * a1)

        let r2 = mimicFillColor.getRed()
        let g2 = mimicFillColor.getGreen()
        let b2 = mimicFillColor.getBlue()
        let a2 = mimicFillColor.getAlpha()
        let fillColor = new ColorUtils(javaColor.RGBtoHSB(r2, g2, b2, null), 255 * a2)

        if (mimicEsp) {
            let [x, y, z] = [mimic.getRenderX(), mimic.getRenderY() - 1, mimic.getRenderZ()]
            let w = 0.6
            let h = 1.3
            let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
            if (shouldHighlight(mimic)) {
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
                RenderUtils.INSTANCE.drawFilledAABB(newBox, fillColor, config.mode == 0)
                RenderUtils.INSTANCE.drawOutlinedAABB(newBox, outlineColor, mimicOutlineWidth, config.mode == 0, true)
            }
        }
    }

    // KEYS

    if (keyEsp) {
        const witherKeyOutlineColor = config.witherKeyOutline
        const witherKeyFillColor = config.witherKeyFill
        const bloodKeyOutlineColor = config.bloodKeyOutline
        const bloodKeyFillColor = config.bloodKeyFill
        const keyOutlineWidth = config.keyOutlineWidth
        const keyTracerWidth = config.keyTracerWidth
        const witherKeyTracerColor = config.witherKeyTracerColor
        const bloodKeyTracerColor = config.bloodKeyFill

        let r1 = witherKeyOutlineColor.getRed()
        let g1 = witherKeyOutlineColor.getGreen()
        let b1 = witherKeyOutlineColor.getBlue()
        let a1 = witherKeyOutlineColor.getAlpha()
        let witherOutlineColor = new ColorUtils(javaColor.RGBtoHSB(r1, g1, b1, null), 255 * a1)

        let r2 = witherKeyFillColor.getRed()
        let g2 = witherKeyFillColor.getGreen()
        let b2 = witherKeyFillColor.getBlue()
        let a2 = witherKeyFillColor.getAlpha()
        let witherFillColor = new ColorUtils(javaColor.RGBtoHSB(r2, g2, b2, null), 255 * a2)

        let r3 = bloodKeyOutlineColor.getRed()
        let g3 = bloodKeyOutlineColor.getGreen()
        let b3 = bloodKeyOutlineColor.getBlue()
        let a3 = bloodKeyOutlineColor.getAlpha()
        let bloodOutlineColor = new ColorUtils(javaColor.RGBtoHSB(r3, g3, b3, null), 255 * a3)

        let r4 = bloodKeyFillColor.getRed()
        let g4 = bloodKeyFillColor.getGreen()
        let b4 = bloodKeyFillColor.getBlue()
        let a4 = bloodKeyFillColor.getAlpha()
        let bloodFillColor = new ColorUtils(javaColor.RGBtoHSB(r4, g4, b4, null), 255 * a4)

        let r5 = witherKeyTracerColor.getRed()
        let g5 = witherKeyTracerColor.getGreen()
        let b5 = witherKeyTracerColor.getBlue()
        let a5 = witherKeyTracerColor.getAlpha()
        let witherTracerColor = new ColorUtils(javaColor.RGBtoHSB(r5, g5, b5, null), 255 * a5)

        let r6 = bloodKeyTracerColor.getRed()
        let g6 = bloodKeyTracerColor.getGreen()
        let b6 = bloodKeyTracerColor.getBlue()
        let a6 = bloodKeyTracerColor.getAlpha()
        let bloodTracerColor = new ColorUtils(javaColor.RGBtoHSB(r6, g6, b6, null), 255 * a6)
    
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
    
            if (config.keyTracer && config.mode == 1) {
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
            
            if (config.keyTracer && config.mode == 1) {
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
        const sheepOutlineColor = config.sheepOutline
        const sheepFillColor = config.sheepFill
        const sheepOutlineWidth = config.sheepOutlineWidth

        let r1 = sheepOutlineColor.getRed()
        let g1 = sheepOutlineColor.getGreen()
        let b1 = sheepOutlineColor.getBlue()
        let a1 = sheepOutlineColor.getAlpha()
        let outlineColor = new ColorUtils(javaColor.RGBtoHSB(r1, g1, b1, null), 255 * a1)

        let r2 = sheepFillColor.getRed()
        let g2 = sheepFillColor.getGreen()
        let b2 = sheepFillColor.getBlue()
        let a2 = sheepFillColor.getAlpha()
        let fillColor = new ColorUtils(javaColor.RGBtoHSB(r2, g2, b2, null), 255 * a2)
    
        for (let i = 0; i < sheeps.length; ++i) {
            let sheep = sheeps[i]
            let [x, y, z] = [sheep.getRenderX(), sheep.getRenderY(), sheep.getRenderZ()]
            let w = 1.5
            let h = 1.5
            let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
            if (shouldHighlight(sheep)) {
                RenderUtils.INSTANCE.drawFilledAABB(newBox, fillColor, phase)
                RenderUtils.INSTANCE.drawOutlinedAABB(newBox, outlineColor, sheepOutlineWidth, phase, true)
                ChatLib.chat("bro what is that white animal on your screen")
            }
        }
    }

    // PESTS

    if (pestEsp) {
        const pestOutlineColor = config.pestOutline
        const pestFillColor = config.pestFill
        const pestOutlineWidth = config.pestOutlineWidth
        const pestTracerColor = config.pestTracerColor
        const pestTracerWidth = config.pestTracerWidth

        let r1 = pestOutlineColor.getRed()
        let g1 = pestOutlineColor.getGreen()
        let b1 = pestOutlineColor.getBlue()
        let a1 = pestOutlineColor.getAlpha()
        let outlineColor = new ColorUtils(javaColor.RGBtoHSB(r1, g1, b1, null), 255 * a1)

        let r2 = pestFillColor.getRed()
        let g2 = pestFillColor.getGreen()
        let b2 = pestFillColor.getBlue()
        let a2 = pestFillColor.getAlpha()
        let fillColor = new ColorUtils(javaColor.RGBtoHSB(r2, g2, b2, null), 255 * a2)

        let r3 = pestTracerColor.getRed()
        let g3 = pestTracerColor.getGreen()
        let b3 = pestTracerColor.getBlue()
        let a3 = pestTracerColor.getAlpha()
        let tracerColor = new ColorUtils(javaColor.RGBtoHSB(r3, g3, b3, null), 255 * a3)

        const playerY = Player.getRenderY() + (Player.isSneaking() ? 1.54 : 1.62)
    
        for (let i = 0; i < pests.length; ++i) {
            let pest = pests[i]
            let [x, y, z] = [pest.getRenderX(), pest.getRenderY() + 1.2, pest.getRenderZ()]
            let w = 0.8
            let h = 0.8
            let newBox = new AxisAlignedBB(x - w / 2, y, z - w / 2, x + w / 2, y + h, z + w / 2)
            if (shouldHighlight(pest)) {
                RenderUtils.INSTANCE.drawFilledAABB(newBox, fillColor, phase)
                RenderUtils.INSTANCE.drawOutlinedAABB(newBox, outlineColor, pestOutlineWidth, phase, true)
            }

            if (config.pestTracer && config.mode == 1) {
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
    starredMobs.clear()
    markedArmorStands.clear()
    witherPhase = 0
    shadowAssassins = []
    witherBoss = null
    secretBats = []
    mimic = null
    mimicChests = []
    witherKeys = []
    bloodKey = null
    sheeps = []
    pests = []
})

register("command", () => {
    return config.openGUI()
}).setName("savage").setAliases(["esp", "se"])