
/*
modified https://github.com/tizzle/aframe-sprite-component
- added materialtextureloaded evt, for the spritesheet component
- added a-assets loading support

*/


AFRAME.registerComponent('sprite', {
    
    schema: {
        src: {
            default: ''
        },
        resize:{
            default: '1 1 1'
        }
    },


    init: function()
    {
        this.textureLoader = new THREE.TextureLoader();        
    },
    play: function()
    {
        var src = this.data.src;
        if(src[0] == '#')
          src = this.el.sceneEl.querySelector('a-assets>'+src).getAttribute('src');
        var self = this;
        this.map = this.textureLoader.load(src, function() {
          self.el.emit('materialtextureloaded', {src: src, texture: self.map}); //make it compatible with the spritesheet thingy!
        });

        this.material = new THREE.SpriteMaterial({
            map: this.map,
            alphaTest : .5,
        });

        this.sprite = new THREE.Sprite(this.material);
        resizeData = this.data.resize.split(' ');
        this.sprite.scale.set( resizeData[0], resizeData[1], resizeData[2] );
        this.el.setObject3D('mesh', this.sprite);
    },


    remove: function() {
        if (this.mesh) this.el.removeObject3D('mesh');
    }

});

AFRAME.registerPrimitive('a-sprite', {
    defaultComponents: {
        sprite: {}
    },
    mappings: {
        src: 'sprite.src',
        resize: 'sprite.resize'
    }
});