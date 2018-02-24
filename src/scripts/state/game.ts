module Alak.State {
    export class Game extends Phaser.State {
        static COLOUR_PALLETE = [
            '#8c5214', '#eaac78', '#ffd4ae', '#19a541',
            '#9abd3b', '#fff', '#ffb0c5', '#e53c70'
        ];

        tempDrawArea: Phaser.BitmapData;

        easelWood: Phaser.Image;
        easelCanvas: Phaser.Image;

        visibleBitmap: Phaser.BitmapData;
        easelImage: Phaser.Image;
        finalBitmap: Phaser.BitmapData;

        subjectScale: number = 0.75;
        subjectLower: Phaser.Image;
        subjectComposite: Phaser.BitmapData;
        subjectCompositeImage: Phaser.Image;

        judgingRect: Phaser.Rectangle;

        easelWidth: number = 380;
        easelHeight: number = 490;
        easelX: number = 400;
        easelY: number = 40;
        subjectX: number = 85;
        subjectY: number = 76;
        brushSize: number = 5;

        lookingAtSubject: boolean = true;
        palette: Entity.Palette;
        currentColour: string;
        prevMousePos: Phaser.Point;
        debug: Phaser.Text;
        debugEnabled: boolean = false;

        create() {
            this.easelWood = new Phaser.Image(this.game, this.easelX + 45, this.easelY - 51, 'easel-wood');
            this.easelCanvas = new Phaser.Image(this.game, this.easelX - 9, this.easelY - 5, 'easel-canvas');
            this.add.existing(this.easelCanvas);

            this.tempDrawArea = new Phaser.BitmapData(this.game, null, this.easelWidth, this.easelHeight);
            this.visibleBitmap = new Phaser.BitmapData(this.game, null, this.easelWidth, this.easelHeight);
            this.easelImage = this.visibleBitmap.addToWorld(this.easelX, this.easelY);
            this.visibleBitmap.fill(237, 232, 218, 1);

            this.finalBitmap = new Phaser.BitmapData(this.game, null, this.easelWidth, this.easelHeight);

            // add wood after painting area
            this.add.existing(this.easelWood);

            this.createSubject();

            this.palette = new Entity.Palette(this.game, -18, 541);
            this.add.existing(this.palette);

            /*this.paintPots.forEach(function (paintpot: Entity.PaintPot) {
                this.add.existing(paintpot);
                paintpot.events.onInputDown.add(this.handleColourChange, this);
            }, this);*/

            this.currentColour = 'blue';

            if (this.debugEnabled) {
                this.debug = new Phaser.Text(this.game, 400, this.game.height - 20, 'Hello', {
                    font: '12px Arial'
                });

                this.add.existing(this.debug);
            }

            window['foo'] = this;

            this.game.canvas.classList.add('hide-cursor');

            let cursor = this.add.sprite(this.game.input.mousePointer.x, this.game.input.mousePointer.y, 'brush-cursor');
            cursor.anchor.set(0.13, 1);

            this.game.input.addMoveCallback(function () {
                cursor.x = Math.round(this.game.input.mousePointer.x);
                cursor.y = Math.round(this.game.input.mousePointer.y);
            }, this);

            this.game.input.onDown.add(function () {
                cursor.loadTexture('brush-cursor-down');
            }, this);

            this.game.input.onUp.add(function () {
                cursor.loadTexture('brush-cursor');
            }, this);

            let timer = this.game.time.create();

            timer.loop(100, function () {
                this.visibleBitmap.fill(237, 232, 218, 0.2);
            }, this);

            timer.start();
        }

        update() {
            let game = this.game;

            if (game.input.activePointer.isDown) {
                let paintX = game.input.x - this.easelX;
                let paintY = game.input.y - this.easelY;

                this.tempDrawArea.circle(paintX, paintY, this.brushSize / 2, this.currentColour);

                if (this.prevMousePos) {
                    this.tempDrawArea.line(paintX, paintY, this.prevMousePos.x, this.prevMousePos.y, this.currentColour, this.brushSize);
                }

                this.visibleBitmap.copy(this.tempDrawArea);
                this.finalBitmap.copy(this.tempDrawArea);
                this.tempDrawArea.clear();

                this.prevMousePos = new Phaser.Point(paintX, paintY);
            } else {
                this.prevMousePos = null;
            }

            //this.visibleBitmap.fill(237, 232, 218, 0.05);

            /*if (this.debugEnabled) {
                let paintX = game.input.x - this.easelX;
                let paintY = game.input.y - this.easelY;

                if (paintX >= 0 && paintY >= 0 && paintX <= this.easelWidth && paintY <= this.easelHeight) {
                    let subjectCol = this.subjectComposite.getPixel(paintX, paintY);
                    let easelCol = this.visibleBitmap.getPixel(paintX, paintY);

                    subjectCol = subjectCol.r + ',' + subjectCol.g + ',' + subjectCol.b;
                    easelCol = easelCol.r + ',' + easelCol.g + ',' + easelCol.b;

                    this.debug.text = paintX + ', ' + paintY + ' | Subject: ' + subjectCol + '| Easel: ' + easelCol;
                }
            }*/
        }

        /*lookAtSubject() {
            this.lookingAtSubject = !this.lookingAtSubject;
            this.moveCanvas(this.lookingAtSubject);
        }*/

        /*moveCanvas(towards: boolean) {
            let duration = 800;
            let easing = Phaser.Easing.Quintic.InOut;
            let easelMoveAmount = 315;
            let subjectMoveAmount = 80;

            if (towards) {
                this.game.add.tween(this.easelImage.position).to({
                    x: this.easelImage.x - easelMoveAmount
                }, duration, easing, true);

                this.game.add.tween(this.easelCanvas.position).to({
                    x: this.easelCanvas.x - easelMoveAmount
                }, duration, easing, true);

                this.game.add.tween(this.easelWood.position).to({
                    x: this.easelWood.x - easelMoveAmount
                }, duration, easing, true);

                this.game.add.tween(this.subjectCompositeImage.position).to({
                    x: this.subjectCompositeImage.x - subjectMoveAmount
                }, duration, easing, true);
            } else {
                this.game.add.tween(this.easelImage.position).to({
                    x: this.easelImage.x + easelMoveAmount
                }, duration, easing, true);

                this.game.add.tween(this.easelCanvas.position).to({
                    x: this.easelCanvas.x + easelMoveAmount
                }, duration, easing, true);

                this.game.add.tween(this.easelWood.position).to({
                    x: this.easelWood.x + easelMoveAmount
                }, duration, easing, true);

                this.game.add.tween(this.subjectCompositeImage.position).to({
                    x: this.subjectCompositeImage.x + subjectMoveAmount
                }, duration, easing, true);
            }
        }*/

        calcScore() {
            let score = 0;
            let total = 0;

            // update BMDs
            this.visibleBitmap.update();
            this.subjectComposite.update();

            // define judging area
            this.judgingRect = new Phaser.Rectangle(30, 10, 290, 480);

            /*let userData = this.visibleBitmap.getPixels(this.judgingRect).data;
            let subjectData = this.subjectComposite.getPixels(this.judgingRect);*/

            // chop up image into 10x10 chunks
            let subjectChunkData = this.calcChunkData(this.subjectComposite.getPixels(this.judgingRect));
            let userChunkData = this.calcChunkData(this.visibleBitmap.getPixels(this.judgingRect));

            for (let i = 0, len = userChunkData.length; i < len; i++) {
                total++;
                if (subjectChunkData[i] !== 0 && userChunkData[i] === subjectChunkData[i]) {
                    score++;
                }
            }

            console.log(score, (score / total) * 100);
        }

        handleColourChange() {
            //this.currentColour = paintPot.colour;
        }

        calcChunkData(sourceData: ImageData): number[] {
            let chunkSize = 10;
            let chunks = [];
            let k = 0;
            let data = sourceData.data;
            let chunkWidth = this.easelWidth / chunkSize;
            let chunkHeight = this.easelHeight / chunkSize;
            let pxChunkSize = chunkSize * 4;

            let checkRow = 1;

            for (let y = 0; y < chunkHeight; y++) {
                for (let x = 0; x < chunkWidth; x++) {
                    let r = (y * pxChunkSize * chunkWidth) + (x * pxChunkSize);

                    chunks[k] = data[r] << 16;
                    chunks[k] = chunks[k] + (data[r + 1] << 8);
                    chunks[k] = chunks[k] + data[r + 2];

                    k++;
                }
            }

            return chunks;
        }

        createSubject() {
            let bodyPerm = Math.floor(Phaser.Math.random(1, Entity.Subject.BODY_PERMS + 1));
            this.subjectLower = this.add.image(this.subjectX - 27, this.easelHeight - 47, 'subject-pants-' + bodyPerm);
            this.subjectLower.scale.x = this.subjectScale;
            this.subjectLower.scale.y = this.subjectScale;

            this.subjectComposite = new Phaser.BitmapData(this.game, null, this.easelWidth, this.easelHeight);

            // shirt
            this.subjectComposite.draw(new Phaser.Image(this.game, 0, 0, 'subject-shirt-' + bodyPerm));

            // build the face
            this.subjectComposite.draw(new Phaser.Image(this.game, 0, 0, 'subject-face'));

            Entity.Subject.FACE_PIECES.forEach(function (piece) {
                let piecePerm = Math.floor(Phaser.Math.random(1, Entity.Subject.FACE_PERMS + 1));
                let key = 'subject-' + piece + '-' + piecePerm;

                this.subjectComposite.draw(new Phaser.Image(this.game, 0, 0, key));
            }, this);


            this.subjectCompositeImage = this.subjectComposite.addToWorld(this.subjectX, this.subjectY);
            this.subjectCompositeImage.scale.x = 0.75;
            this.subjectCompositeImage.scale.y = 0.75;
        }
    }
}
