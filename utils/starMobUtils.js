const minis = ["Lost Adventurer", "Angry Archaeologist", "Frozen Adventurer"]
const tanky = ["Zombie Commander", "Zombie Lord", "Skeleton Lord", "Withermancer", "Super Archer"]

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
        let mobName = this.entity.getName();
        this.mobType = 0;
        for (let m of minis) {
            if (mobName.includes(m)) {
                this.mobType = 1;
            }
        }
        if (mobName.includes("Fels")) {
            this.mobType = 2;
        }
        for (let t of tanky) {
            if (mobName.includes(t)) {
                this.mobType = 3;
            }
        }

        this.name = mobName;

        this.x = this.entity.getX()
        this.y = this.entity.getY()
        this.z = this.entity.getZ()
    }
}