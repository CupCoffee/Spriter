<template>
    <div id="app">
        <span style="display: block; width: 100px; height: 50px;" :style="{backgroundColor}"></span>
        <canvas ref="canvas">
        </canvas>
    </div>
</template>

<script>
    import SpriteExtractor from "./Sprite/SpriteExtractor";
    import {imageDataUrl} from './Temp';
    import _ from 'lodash';

    export default {
        data() {
            return {
                /**
                 * @type {SpriteExtractor}
                 */
                spriteExtractor: null,
                backgroundColor: null
            }
        },

        mounted() {
            let canvas = this.$refs.canvas;
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            this.context2D = canvas.getContext('2d');

            let image = new Image();

            image.onload = () => {

                this.spriteExtractor = new SpriteExtractor(image);
                this.spriteExtractor.extract();

                this.backgroundColor = this.spriteExtractor.getBackgroundColor();
            };

            image.src = imageDataUrl;
        },

        methods: {
            openFile(e) {
                let file = e.target.files[0];

                let fileReader = new FileReader();
                fileReader.onload = e => this.readFile(e.target.result);
                fileReader.readAsDataURL(file);
            },

            readFile(content) {
                let image = new Image();

                console.log(content);

                image.onload = e => this.ctx.drawImage(image, 0, 0);

                image.src = content;
            }

        }
    }
</script>

<style>
    body {
        margin: 0;
    }
</style>
