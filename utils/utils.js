import config from "../config"

export const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand")
export const EntityOtherPlayerMP = Java.type("net.minecraft.client.entity.EntityOtherPlayerMP")
export const EntityBat = Java.type("net.minecraft.entity.passive.EntityBat")
export const EntityWither = Java.type("net.minecraft.entity.boss.EntityWither")
export const EntityZombie = Java.type("net.minecraft.entity.monster.EntityZombie")
export const EntitySheep = Java.type("net.minecraft.entity.passive.EntitySheep")
export const TileEntityChest = Java.type("net.minecraft.tileentity.TileEntityChest")

export const S0EPacketSpawnObject = Java.type("net.minecraft.network.play.server.S0EPacketSpawnObject")
export const S13PacketDestroyEntities = Java.type("net.minecraft.network.play.server.S13PacketDestroyEntities")

export const RenderUtils = Java.type("me.odinmain.utils.render.RenderUtils");
export const ColorUtils = Java.type("me.odinmain.utils.render.Color");
export const AxisAlignedBB = Java.type("net.minecraft.util.AxisAlignedBB");
export const javaColor = Java.type("java.awt.Color")
export const Vec3 = Java.type("net.minecraft.util.Vec3")

export const starMobRegex = /§6✯ (?:§.)*(.+)§r.+§c❤$|^(Shadow Assassin)$/

export const getTrappedChests = () => World.getWorld().field_147482_g.filter(e => e instanceof TileEntityChest && e.func_145980_j() == 1).map(e => [e.func_174877_v().func_177958_n(), e.func_174877_v().func_177956_o(), e.func_174877_v().func_177952_p()])

export function isValidEntity(entity) {
    if (!entity) return false
    else if (entity instanceof EntityArmorStand) return false
    else if (entity instanceof EntityWither) return false
    else if (entity == Player.getPlayer()) return false
    else return true
}

export function shouldHighlight(entity) {
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

export function shouldHighlightArmorStand(entity) {
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

export function shouldHighlightKey(entity) {
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

let witherphase = 0;

register("chat", (message) => {
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

register("worldLoad", () => {
    witherPhase = 0;
})

export function getPhase() {
    return witherphase;
}

export function inGarden() {
    let index = TabList?.getNames()?.findIndex(line => line?.removeFormatting()?.toLowerCase()?.includes("area: garden"))
    if (index > -1) return true;
    return false;
}