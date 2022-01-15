import React, { useRef, useEffect } from "react";
import "./helpers/Globals";
import "p5/lib/addons/p5.sound";
import * as p5 from "p5";
import { Midi } from '@tonejs/midi'
import PlayIcon from './functions/PlayIcon.js';
import ShuffleArray from './functions/ShuffleArray.js';
import AnimatedTriangle from './classes/AnimatedTriangle.js';

import audio from "../audio/triangles-no-4.ogg";
import midi from "../audio/triangles-no-4.mid";

const P5SketchWithAudio = () => {
    const sketchRef = useRef();

    const Sketch = p => {

        p.canvas = null;

        p.canvasWidth = window.innerWidth;

        p.canvasHeight = window.innerHeight;

        p.audioLoaded = false;

        p.player = null;

        p.PPQ = 3840 * 4;

        p.loadMidi = () => {
            Midi.fromUrl(midi).then(
                function(result) {
                    console.log(result);
                    const noteSet1 = result.tracks[4].notes; // Sampler 1 - worn1
                    const noteSet2 = result.tracks[1].notes; // Synth 1 - Hyperbottom
                    const noteSet3 = result.tracks[7].notes; // Sampler 2 - J60 Logos
                    p.scheduleCueSet(noteSet1, 'executeCueSet1');
                    p.scheduleCueSet(noteSet2, 'executeCueSet2');
                    p.scheduleCueSet(noteSet3, 'executeCueSet3');
                    p.audioLoaded = true;
                    document.getElementById("loader").classList.add("loading--complete");
                    document.getElementById("play-icon").classList.remove("fade-out");
                }
            );    
        }

        p.preload = () => {
            p.song = p.loadSound(audio, p.loadMidi);
            p.song.onended(p.logCredits);
        }

        p.scheduleCueSet = (noteSet, callbackName, poly = false)  => {
            let lastTicks = -1,
                currentCue = 1;
            for (let i = 0; i < noteSet.length; i++) {
                const note = noteSet[i],
                    { ticks, time } = note;
                if(ticks !== lastTicks || poly){
                    note.currentCue = currentCue;
                    p.song.addCue(time, p[callbackName], note);
                    lastTicks = ticks;
                    currentCue++;
                }
            }
        } 

        p.bgColour = 0;

        p.setup = () => {
            p.canvas = p.createCanvas(p.canvasWidth, p.canvasHeight);
            p.background(p.bgColour);
            p.colorMode(p.HSB);
            p.frameRate(30);
        }

        p.triangles = [];

        p.spinningTriangles = [];

        p.draw = () => {
            if(p.audioLoaded && p.song.isPlaying()){
                p.background(p.bgColour);
                for (let i = 0; i < p.triangles.length; i++) {
                    const triangle = p.triangles[i],
                     {hue, x1, y1, x2, y2, x3, y3, canDraw} = triangle;
                    if(canDraw){
                        p.noFill();
                        p.stroke(hue, 100, 100, 0.5);
                        p.strokeWeight(16);
                        p.triangle(x1, y1, x2, y2, x3, y3);
                    }
                }

                for (let i = 0; i < p.spinningTriangles.length; i++) {
                    const triangle = p.spinningTriangles[i];
                    triangle.update();
                    triangle.draw();
                }
            }
        }

        p.executeCueSet1 = (note) => {
            const hue = p.random(0, 360),
                { currentCue } = note,
                scale = currentCue % 19, 
                arrayIndex = scale === 0 ? 18 : scale - 1;
            if(scale === 1 && currentCue < 77) {
                for (let i = 0; i < 19; i++) {
                    p.triangles[i] = {};
                }
            }
            else if(scale === 1 && currentCue >= 77) {
                for (let i = 0; i < 19; i++) {
                    p.triangles[i].canDraw = false;
                }
                p.triangles = ShuffleArray(p.triangles);
                console.log(p.triangles);
            }
            p.triangles[arrayIndex].hue = hue;
            p.triangles[arrayIndex].canDraw = true;
            if(currentCue < 77) {
                p.triangles[arrayIndex].x1 = p.width / 2;
                p.triangles[arrayIndex].y1 = 0 + (p.height/16 * scale);
                p.triangles[arrayIndex].x2 = 0 + (p.width/16 * scale);
                p.triangles[arrayIndex].y2 = p.height - (p.height/16 * scale);
                p.triangles[arrayIndex].x3 = p.width - (p.width/16 * scale);
                p.triangles[arrayIndex].y3 = p.height - (p.height/16 * scale);
                
            }
        }

        p.executeCueSet2 = (note) => {
            const { currentCue } = note,
                multiplier = currentCue === 1 ? 32 : (currentCue - 1) % 8 === 0 ? 8 : (currentCue - 1) % 8;
            p.bgColour = 255 / 32 * multiplier;
        }

        p.executeCueSet3 = (note) => {
            p.spinningTriangles.push(
                new AnimatedTriangle(p, p.width/2, p.height/2, p.width/16)
            );
        }

        p.mousePressed = () => {
            if(p.audioLoaded){
                if (p.song.isPlaying()) {
                    p.song.pause();
                } else {
                    if (parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)) {
                        p.reset();
                    }
                    document.getElementById("play-icon").classList.add("fade-out");
                    p.canvas.addClass("fade-in");
                    p.song.play();
                }
            }
        }

        p.creditsLogged = false;

        p.logCredits = () => {
            if (
                !p.creditsLogged &&
                parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)
            ) {
                p.creditsLogged = true;
                    console.log(
                    "Music By: http://labcat.nz/",
                    "\n",
                    "Animation By: https://github.com/LABCAT/"
                );
                p.song.stop();
            }
        };

        p.reset = () => {

        }

        p.updateCanvasDimensions = () => {
            p.canvasWidth = window.innerWidth;
            p.canvasHeight = window.innerHeight;
            p.canvas = p.resizeCanvas(p.canvasWidth, p.canvasHeight);
        }

        if (window.attachEvent) {
            window.attachEvent(
                'onresize',
                function () {
                    p.updateCanvasDimensions();
                }
            );
        }
        else if (window.addEventListener) {
            window.addEventListener(
                'resize',
                function () {
                    p.updateCanvasDimensions();
                },
                true
            );
        }
        else {
            //The browser does not support Javascript event binding
        }
    };

    useEffect(() => {
        new p5(Sketch, sketchRef.current);
    }, []);

    return (
        <div ref={sketchRef}>
            <PlayIcon />
        </div>
    );
};

export default P5SketchWithAudio;
