//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    private mouseX: number = 0;
    private mouseY: number = 0;
    private paddleW: number = 10;
    private paddleH: number = 100;
    static default_vx:number = 18;
    private vx: number = Main.default_vx;
    static default_vy:number = 6;
    private vy: number = Main.default_vy;
    private score1p: number = 0;
    private score2p: number = 0;
    private scoreMax: number = 1;
    private gameSet: boolean = false;
    private bx: number = 0;
    private by: number = 0;
    private p2y: number = 250;
    private p1y: number = 250;

    private _screen: egret.Shape = new egret.Shape();
    private _line: egret.Shape = new egret.Shape();
    private _paddle1: egret.Shape = new egret.Shape();
    private _paddle2: egret.Shape = new egret.Shape();
    private _ball: egret.Shape = new egret.Shape();
    private _label: egret.TextField = new egret.TextField();

    init() {
        this.mouseX = 0;
        this.mouseY = 0;
        this.score1p = 0;
        this.score2p = 0;
        this.gameSet = false;
        this.bx = this.stage.stageWidth / 2;
        this.by = this.stage.stageHeight / 2;
        this.vx = Main.default_vx;
        this.vy = Main.default_vy;
        this.p2y = 250;
        this.p1y = 250;

        this.addChild(this._screen);
        this.addChild(this._line);
        this.addChild(this._line);
        this.addChild(this._paddle1);
        this.addChild(this._paddle2);
        this.addChild(this._ball);

        this._label.text = "";
        this._label.bold = false;
        this._label.width = this.stage.stageWidth;
        this._label.height = this.stage.stageHeight / 3;
        this._label.textAlign = egret.HorizontalAlign.CENTER;
        this._label.size = 30;
        this._label.textColor = 0xffffff;
        this._label.x = 0;
        this._label.y = this.stage.stageHeight / 2;
        this._label.wordWrap = true;
        this.addChild(this._label);
    }

    move() {
        if (this.gameSet) {
            return;
        }

        this.cpu();

        this.bx += this.vx;
        this.by += this.vy;

        if (this.bx < 0) {
            if (this.by > this.p1y && this.by < this.p1y + this.paddleH) {
                this.vx = -this.vx;

                var dy = this.by - (this.p1y + this.paddleH / 2);
                this.vy = dy * 0.35;
            } else {
                this.score2p++;
                this.resetBall();
            }
        }

        if (this.bx > this.stage.stageWidth) {
            if (this.by > this.p2y && this.by < this.p2y + this.paddleH) {
                this.vx = -this.vx;

                var dy = this.by - (this.p2y + this.paddleH / 2);
                this.vy = dy * 0.35;
            } else {
                this.score1p++;
                this.resetBall();

            }
        }

        if (this.by > this.stage.stageHeight || this.by < 0) {
            this.vy = -this.vy;
        }
    }

    draw() {
        this.screen(0, 0, this.stage.stageWidth, this.stage.stageHeight, 0x111);
        this.line(this.stage.stageWidth / 2, 0, this.stage.stageWidth / 2, this.stage.stageHeight, 0xaaa);
        if (this.gameSet) {
            this.gameSetWindow();
            return;
        }
        this.paddle(this._paddle1, 0, this.p1y, this.paddleW, this.paddleH, 0x22aa22);
        this.paddle(this._paddle2, this.stage.stageWidth - this.paddleW, this.p2y, this.paddleW, this.paddleH, 0xaa2222);
        this.ball(this._ball, this.bx, this.by, 10, 0xddd);
    }

    ball(shape: egret.Shape, x: number, y: number, r: number, color: number) {
        shape.graphics.clear();
        shape.graphics.beginFill(color);
        shape.graphics.lineStyle(2, color);
        shape.graphics.drawCircle(x, y, r);
        shape.graphics.endFill();
    }

    paddle(shape: egret.Shape, x: number, y: number, w: number, h: number, color: number) {
        shape.graphics.clear();
        shape.graphics.beginFill(color);
        shape.graphics.lineStyle(2, color);
        shape.graphics.drawRect(x - w / 2, y - h / 2, w, h);
        shape.graphics.endFill();
    }

    screen(x: number, y: number, w: number, h: number, color: number) {
        this._screen.graphics.beginFill(color);
        this._screen.graphics.lineStyle(2, color);
        this._screen.graphics.drawRect(x, y, w, h);
        this._screen.graphics.endFill();
    }

    line(x1: number, y1: number, x2: number, y2: number, color: number) {
        this._line.graphics.lineStyle(2, color);
        this._line.graphics.moveTo(x1, y1);
        this._line.graphics.lineTo(x2, y2);
    }

    resetBall() {
        if (this.score1p >= this.scoreMax || this.score2p >= this.scoreMax) {
            this.gameSet = true;
        }
        this.bx = this.stage.stageWidth / 2;
        this.by = this.stage.stageHeight / 2;
        this.vx = -this.vx;
    }
    
    cpu() {
        var p2yCentre = this.p2y + (this.paddleH / 2);
        if (p2yCentre < this.by - 35) {
            this.p2y += 6;
        } else if (p2yCentre > this.by + 35) {
            this.p2y -= 6;
        }
    }

    gameSetWindow() {
        if (this.score1p >= this.scoreMax) {
            this._label.text = "You're WINNER!";
        } else {
            this._label.text = "You're LOSEER!";
        }
        this._label.text += "\n\nContinue? [Yes:click window]";
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.reset, this);
    }

    reset(evt: egret.TouchEvent) {
        this.stage.removeEventListener(evt.type, this.reset, this);

        if (this.gameSet) {
            this.removeChildren();
            this.init();
            this.draw();
        }
    }

    ////

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event: egret.Event) {
        this.init();

        let self = this;
        egret.lifecycle.addLifecycleListener((context) => {
            context.onUpdate = () => {
                self.move();
                self.draw();
            }
        });
        egret.lifecycle.onPause = this.onPause;
        egret.lifecycle.onResume = this.onResume;

        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBegin, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMove, this);
    }

    private onPause() {
        egret.ticker.pause();
    }

    private onResume() {
        egret.ticker.resume();
    }

    private touchBegin(evt:egret.TouchEvent) {
        this.mouseX = evt.stageX;
        this.mouseY = evt.stageY;
    }

    private touchMove(evt:egret.TouchEvent) {
        this.touchBegin(evt);
        this.p1y = this.mouseY - (this.paddleH / 2);
    }
}

