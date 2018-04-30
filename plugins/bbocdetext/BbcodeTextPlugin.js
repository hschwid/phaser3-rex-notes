import Text from './../utils/text/Text.js';
import parser from './Parser.js';

const GetAdvancedValue = Phaser.Utils.Objects.GetAdvancedValue;

class BBCodeText extends Text {
    constructor(scene, x, y, text, style) {
        super(scene, x, y, text, style, 'BBCodeText', parser);
    }
}

Phaser.GameObjects.GameObjectFactory.register('rexBBCodeText', function (x, y, text, style) {
    return this.displayList.add(new BBCodeText(this.scene, x, y, text, style));
});
Phaser.GameObjects.GameObjectCreator.register('rexBBCodeText', function (config) {
    // style Object = {
    //     font: [ 'font', '16px Courier' ],
    //     backgroundColor: [ 'backgroundColor', null ],
    //     fill: [ 'fill', '#fff' ],
    //     stroke: [ 'stroke', '#fff' ],
    //     strokeThickness: [ 'strokeThickness', 0 ],
    //     shadowOffsetX: [ 'shadow.offsetX', 0 ],
    //     shadowOffsetY: [ 'shadow.offsetY', 0 ],
    //     shadowColor: [ 'shadow.color', '#000' ],
    //     shadowBlur: [ 'shadow.blur', 0 ],
    //     shadowStroke: [ 'shadow.stroke', false ],
    //     shadowFill: [ 'shadow.fill', false ],
    //     align: [ 'align', 'left' ],
    //     maxLines: [ 'maxLines', 0 ],
    //     fixedWidth: [ 'fixedWidth', false ],
    //     fixedHeight: [ 'fixedHeight', false ]
    // }

    var content = GetAdvancedValue(config, 'text', '');
    var style = GetAdvancedValue(config, 'style', null);

    //  Padding
    //      { padding: 2 }
    //      { padding: { x: , y: }}
    //      { padding: { left: , top: }}
    //      { padding: { left: , right: , top: , bottom: }}  

    var padding = GetAdvancedValue(config, 'padding', null);

    if (padding !== null) {
        style.padding = padding;
    }

    var text = new BBCodeText(this.scene, 0, 0, content, style);
    BuildGameObject(this.scene, text, config);

    //  Text specific config options:

    text.autoRound = GetAdvancedValue(config, 'autoRound', true);
    text.resolution = GetAdvancedValue(config, 'resolution', 1);

    return text;
});
export default BBCodeText;