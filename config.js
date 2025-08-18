import {
    @ButtonProperty,
    @CheckboxProperty,
    Color,
    @ColorProperty,
    @PercentSliderProperty,
    @SelectorProperty,
    @SwitchProperty,
    @TextProperty,
    @Vigilant,
    @SliderProperty,
    @DecimalSliderProperty,
    @NumberProperty,
} from '../Vigilance/index';

@Vigilant("SavageESP", "Savage ESP", {
    getCategoryComparator: () => (a, b) => {
        const categories = ["ESP", "Tracers"];
        return categories.indexOf(a.name) - categories.indexOf(b.name);
    },
    getSubcategoryComparator: () => (a, b) => {
        const subcategories = ["Mode", "Star Mob", "Wither", "Bat", "Mimic", "Keys", "Sheep", "Pests", "Custom"];
        return subcategories.indexOf(a.getValue()[0].attributesExt.subcategory) - subcategories.indexOf(b.getValue()[0].attributesExt.subcategory);
    },
    getPropertyComparator: () => (a, b) => {
        const names = ["Star Mob ESP", "Wither ESP", "Bat ESP", "Mimic ESP", "Mimic Chest ESP", "Key ESP", "Pest ESP", "Custom ESP", 
            "Outline Color", "Fill Color", "Wither Key Outline Color", "Wither Key Fill Color", "Blood Key Outline Color", "Blood Key Fill Color", "Outline Line Width", "Wither ESP Width",
            "Goldor Tracer", "Key Tracer", "Line Width", "Line Color", "Wither Key Tracer Color", "Blood Key Tracer Color"];
        return names.indexOf(a.attributesExt.name) - names.indexOf(b.attributesExt.name);
    }
})

class config {

    constructor() {
        this.initialize(this)
    }

    @SelectorProperty({
        name: "Mode",
        description: "Savage mode",
        category: "ESP",
        subcategory: "Mode",
        options: [
            "Highlight",
            "ESP"
        ]
    })
    mode = 0;



    @SwitchProperty({
        name: "Star Mob ESP",
        description: "Highlights starred mobs in dungeons",
        category: "ESP",
        subcategory: "Star Mob"
    })
    starEsp = false;
    @ColorProperty({
        name: "Outline Color",
        description: "Box outline color for star mob esp",
        category: "ESP",
        subcategory: "Star Mob"
    })
    starOutline = new Color(1, 1, 1, 1);
    @ColorProperty({
        name: "Fill Color",
        description: "Box fill color for star mob esp",
        category: "ESP",
        subcategory: "Star Mob"
    })
    starFill = new Color(1, 1, 1, 1);
    @NumberProperty({
        name: "Outline Line Width",
        description: "Width of star mob outline",
        category: "ESP",
        subcategory: "Star Mob",
        min: 1,
        max: 10,
        increment: 1
    })
    starOutlineWidth = 2;



    @SwitchProperty({
        name: "Wither ESP",
        description: "Highlights wither bosses in dungeons",
        category: "ESP",
        subcategory: "Wither"
    })
    witherEsp = false;
    @ColorProperty({
        name: "Outline Color",
        description: "Box outline color for wither esp",
        category: "ESP",
        subcategory: "Wither"
    })
    witherOutline = new Color(1, 1, 1, 1);
    @ColorProperty({
        name: "Fill Color",
        description: "Box fill color for wither esp",
        category: "ESP",
        subcategory: "Wither"
    })
    witherFill = new Color(1, 1, 1, 1);
    @NumberProperty({
        name: "Outline Line Width",
        description: "Width of wither outline",
        category: "ESP",
        subcategory: "Wither",
        min: 1,
        max: 10,
        increment: 1
    })
    witherOutlineWidth = 2;
    @DecimalSliderProperty({
        name: "Wither ESP Width",
        description: "Width of wither esp",
        category: "ESP",
        subcategory: "Wither",
        minF: 1,
        maxF: 4
    })
    witherEspWidth = 3;



    @SwitchProperty({
        name: "Bat ESP",
        description: "Highlights bats in dungeons",
        category: "ESP",
        subcategory: "Bat"
    })
    batEsp = false;
    @ColorProperty({
        name: "Outline Color",
        description: "Box outline color for bat esp",
        category: "ESP",
        subcategory: "Bat"
    })
    batOutline = new Color(1, 1, 1, 1);
    @ColorProperty({
        name: "Fill Color",
        description: "Box fill color for bat esp",
        category: "ESP",
        subcategory: "Bat"
    })
    batFill = new Color(1, 1, 1, 1);
    @NumberProperty({
        name: "Outline Line Width",
        description: "Width of bat outline",
        category: "ESP",
        subcategory: "Bat",
        min: 1,
        max: 10,
        increment: 1
    })
    batOutlineWidth = 2;



    @SwitchProperty({
        name: "Mimic ESP",
        description: "Highlights mimics in dungeons",
        category: "ESP",
        subcategory: "Mimic"
    })
    mimicEsp = false;
    @SwitchProperty({
        name: "Mimic Chest ESP",
        description: "Highlights the mimic chest in dungeons",
        category: "ESP",
        subcategory: "Mimic"
    })
    mimicChestEsp = false;
    @ColorProperty({
        name: "Outline Color",
        description: "Box outline color for mimic esp",
        category: "ESP",
        subcategory: "Mimic"
    })
    mimicOutline = new Color(1, 1, 1, 1);
    @ColorProperty({
        name: "Fill Color",
        description: "Box fill color for mimic esp",
        category: "ESP",
        subcategory: "Mimic"
    })
    mimicFill = new Color(1, 1, 1, 1);
    @NumberProperty({
        name: "Outline Line Width",
        description: "Width of mimic outline",
        category: "ESP",
        subcategory: "Mimic",
        min: 1,
        max: 10,
        increment: 1
    })
    mimicOutlineWidth = 2;



    @SwitchProperty({
        name: "Key ESP", 
        description: "Highlights wither and blood keys",
        category: "ESP",
        subcategory: "Keys",
    })
    keyEsp = false;
    @ColorProperty({
        name: "Wither Key Outline Color",
        description: "Box outline color for wither key esp",
        category: "ESP",
        subcategory: "Keys"
    })
    witherKeyOutline = new Color(0, 0, 0, 1);
    @ColorProperty({
        name: "Wither Key Fill Color",
        description: "Box fill color for wither key esp",
        category: "ESP",
        subcategory: "Keys"
    })
    witherKeyFill = new Color(0, 0, 0, 1);
    @ColorProperty({
        name: "Blood Key Outline Color",
        description: "Box outline color for blood key esp",
        category: "ESP",
        subcategory: "Keys"
    })
    bloodKeyOutline = new Color(1, 0, 0, 1);
    @ColorProperty({
        name: "Blood Key Fill Color",
        description: "Box fill color for blood key esp",
        category: "ESP",
        subcategory: "Keys"
    })
    bloodKeyFill = new Color(1, 0, 0, 1);
    @NumberProperty({
        name: "Outline Line Width",
        description: "Width of key outline",
        category: "ESP",
        subcategory: "Keys",
        min: 1,
        max: 10,
        increment: 1
    })
    keyOutlineWidth = 2;



    @SwitchProperty({
        name: "Guided Sheep Hider",
        description: "Hides guided sheep",
        category: "ESP",
        subcategory: "Sheep"
    })
    hideSheep = false;
    @SwitchProperty({
        name: "Highlight Sheep",
        description: "Replaces guided sheep with a box",
        category: "ESP",
        subcategory: "Sheep"
    })
    highlightSheep = false;
    @ColorProperty({
        name: "Outline Color",
        description: "Box outline color for sheep highlight",
        category: "ESP",
        subcategory: "Sheep"
    })
    sheepOutline = new Color(1, 1, 1, 1);
    @ColorProperty({
        name: "Fill Color",
        description: "Box fill color for sheep highlight",
        category: "ESP",
        subcategory: "Sheep"
    })
    sheepFill = new Color(1, 1, 1, 0);
    @NumberProperty({
        name: "Outline Line Width",
        description: "Width of sheep highlight outline",
        category: "ESP",
        subcategory: "Sheep",
        min: 1,
        max: 10,
        increment: 1
    })
    sheepOutlineWidth = 2;



    @SwitchProperty({
        name: "Pest ESP",
        description: "Highlights pests on the garden",
        category: "ESP",
        subcategory: "Pests"
    })
    pestEsp = false;
    @ColorProperty({
        name: "Outline Color",
        description: "Box outline color for pest esp",
        category: "ESP",
        subcategory: "Pests"
    })
    pestOutline = new Color(1, 1, 1, 1);
    @ColorProperty({
        name: "Fill Color",
        description: "Box fill color for pest esp",
        category: "ESP",
        subcategory: "Pests"
    })
    pestFill = new Color(1, 1, 1, 1);
    @NumberProperty({
        name: "Outline Line Width",
        description: "Width of pest outline",
        category: "ESP",
        subcategory: "Pests",
        min: 1,
        max: 10,
        increment: 1
    })
    pestOutlineWidth = 2;
    


    @SwitchProperty({
        name: "Custom ESP",
        description: "Highlights specific custom mobs [/esp add <mob name>]",
        category: "ESP",
        subcategory: "Custom"
    })
    customEsp = false;
    @ColorProperty({
        name: "Outline Color",
        description: "Box outline color for custom esp",
        category: "ESP",
        subcategory: "Custom"
    })
    customOutline = new Color(1, 1, 1, 1);
    @ColorProperty({
        name: "Fill Color",
        description: "Box fill color for custom esp",
        category: "ESP",
        subcategory: "Custom"
    })
    customFill = new Color(1, 1, 1, 1);
    @NumberProperty({
        name: "Outline Line Width",
        description: "Width of custom outline",
        category: "ESP",
        subcategory: "Custom",
        min: 1,
        max: 10,
        increment: 1
    })
    customOutlineWidth = 2;

    
    /*
    * Tracers
    */


    @SwitchProperty({
        name: "Goldor Tracer",
        description: "Draws a line to where goldor comes from",
        category: "Tracers",
        subcategory: "Goldor"
    })
    goldorTracer = false;
    @NumberProperty({
        name: "Line Width",
        description: "Width of goldor tracer line",
        category: "Tracers",
        subcategory: "Goldor",
        min: 1,
        max: 10,
        increment: 1
    })
    goldorTracerWidth = 2;
    @ColorProperty({
        name: "Line Color",
        description: "Color of goldor tracer line",
        category: "Tracers",
        subcategory: "Goldor"
    })
    goldorTracerColor = new Color(1, 0, 0, 1);



    @SwitchProperty({
        name: "Key Tracer",
        description: "Draws a line to wither keys",
        category: "Tracers",
        subcategory: "Keys"
    })
    keyTracer = false;
    @NumberProperty({
        name: "Line Width",
        description: "Width of key tracer line",
        category: "Tracers",
        subcategory: "Keys",
        min: 1,
        max: 10,
        increment: 1
    })
    keyTracerWidth = 2;
    @ColorProperty({
        name: "Wither Key Tracer Color",
        description: "Color of wither key tracer line",
        category: "Tracers",
        subcategory: "Keys"
    })
    witherKeyTracerColor = new Color(0, 0, 0, 1);
    @ColorProperty({
        name: "Blood Key Tracer Color",
        description: "Color of blood key tracer line",
        category: "Tracers",
        subcategory: "Keys"
    })
    bloodKeyTracerColor = new Color(1, 0, 0, 1);



    @SwitchProperty({
        name: "Pest Tracer",
        description: "Draws a line to pests",
        category: "Tracers",
        subcategory: "Pests"
    })
    pestTracer = false;
    @NumberProperty({
        name: "Line Width",
        description: "Width of pest tracer line",
        category: "Tracers",
        subcategory: "Pests",
        min: 1,
        max: 10,
        increment: 1
    })
    pestTracerWidth = 2;
    @ColorProperty({
        name: "Line Color",
        description: "Color of pest tracer line",
        category: "Tracers",
        subcategory: "Pests"
    })
    pestTracerColor = new Color(1, 0, 0, 1);

}

export default new config()