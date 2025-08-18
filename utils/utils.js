export const EntityArmorStand = Java.type("net.minecraft.entity.item.EntityArmorStand")
export const EntityOtherPlayerMP = Java.type("net.minecraft.client.entity.EntityOtherPlayerMP")
export const EntityBat = Java.type("net.minecraft.entity.passive.EntityBat")
export const EntityWither = Java.type("net.minecraft.entity.boss.EntityWither")
export const EntityZombie = Java.type("net.minecraft.entity.monster.EntityZombie")
export const EntitySheep = Java.type("net.minecraft.entity.passive.EntitySheep")
export const TileEntityChest = Java.type("net.minecraft.tileentity.TileEntityChest")
export const S0EPacketSpawnObject = Java.type("net.minecraft.network.play.server.S0EPacketSpawnObject")
export const S13PacketDestroyEntities = Java.type("net.minecraft.network.play.server.S13PacketDestroyEntities")

export const getTrappedChests = () => World.getWorld().field_147482_g.filter(e => e instanceof TileEntityChest && e.func_145980_j() == 1).map(e => [e.func_174877_v().func_177958_n(), e.func_174877_v().func_177956_o(), e.func_174877_v().func_177952_p()])

export default class StarMob {
    constructor(entity) {
        this.entity = entity
        this.name = entity.getName()
        this.updateHeight()

        this.update()
    }

    updateHeight() {
        const [_, mobName, sa] = this.name.match(/§6✯ (?:§.)*(.+)§r.+§c❤$|^(Shadow Assassin)$/)

        this.height = 1.95

        // Shadow assassins are just called "Shadow Assassin"

        if (!sa) {
            if (mobName.includes("Fels")) {
                this.height = 3
            }
            else if (mobName.includes("Withermancer")) {
                this.height = 2.535
            } else if (mobName.includes("Zombie") || mobName.includes("Crypt Lurker")) {
                this.height = 2.05
            } else if (mobName.includes("Skeleton") || mobName.includes("Sniper") || mobName.includes("Super Archer")) {
                this.height = 2.15
            }
        } else {
            this.height = -1.95
        }
        
    }

    update() {
        this.name = this.entity.getName()

        this.x = this.entity.getX()
        this.y = this.entity.getY()
        this.z = this.entity.getZ()
    }
}