'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Press_Start_2P } from 'next/font/google';
import Link from 'next/link';

const gameFont = Press_Start_2P({ weight: '400', subsets: ['latin'] });

const SHOWDOWN = 'https://play.pokemonshowdown.com/sprites';

const TRAINERS = [
    { id: 'red',     name: 'Red',     src: `${SHOWDOWN}/trainers/red.png` },
    { id: 'hilbert', name: 'Hilbert', src: `${SHOWDOWN}/trainers/hilbert.png` },
    { id: 'dawn',    name: 'Dawn',    src: `${SHOWDOWN}/trainers/dawn.png` },
    { id: 'hilda',   name: 'Hilda',   src: `${SHOWDOWN}/trainers/hilda.png` },
    { id: 'ethan',   name: 'Ethan',   src: `${SHOWDOWN}/trainers/ethan.png` },
    { id: 'rosa',    name: 'Rosa',    src: `${SHOWDOWN}/trainers/rosa.png` },
    { id: 'brendan', name: 'Brendan', src: `${SHOWDOWN}/trainers/brendan.png` },
    { id: 'serena',  name: 'Serena',  src: `${SHOWDOWN}/trainers/serena.png` },
    { id: 'lucas',   name: 'Lucas',   src: `${SHOWDOWN}/trainers/lucas.png` },
    { id: 'leaf',    name: 'Leaf',    src: `${SHOWDOWN}/trainers/leaf.png` },
];

const ENEMY_TYPE = 'psychic';

const EFFECTIVENESS = {
    bug: { psychic: 2 }, dark: { psychic: 2 }, ghost: { psychic: 2 },
    fighting: { psychic: 0.5 }, psychic: { psychic: 0.5 },
    normal: {}, fire: {}, electric: {}, poison: {}, water: {}, grass: {},
};

function getEff(atkType) {
    return EFFECTIVENESS[atkType]?.[ENEMY_TYPE] ?? 1;
}

const POKEMON = [
    {
        id: 'infernmark',
        name: 'INFERNMARK',
        base: 'Infernape',
        sprite: `${SHOWDOWN}/gen5ani-back/infernape.gif`,
        spriteFb: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/392.png',
        maxHp: 120, level: 50,
        moves: [
            { name: 'git bisect',    type: 'dark',    dmg: [14, 20], msg: 'Traced the cursed commit!' },
            { name: 'Unit Tests',    type: 'bug',     dmg: [12, 18], msg: 'All 347 tests passing!' },
            { name: 'Code Review',   type: 'ghost',   dmg: [10, 16], msg: 'Found 12 issues in PR!' },
            { name: 'Copy Paste',    type: 'psychic', dmg: [18, 30], msg: 'Ctrl+C Ctrl+V from SO...' },
        ],
    },
    {
        id: 'markasaur',
        name: 'MARKASAUR',
        base: 'Venusaur',
        sprite: `${SHOWDOWN}/gen5ani-back/venusaur.gif`,
        spriteFb: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/3.png',
        maxHp: 130, level: 50,
        moves: [
            { name: 'Refactor',      type: 'bug',     dmg: [13, 19], msg: 'Clean code achieved!' },
            { name: 'Dark Deploy',   type: 'dark',    dmg: [15, 22], msg: 'Deployed at 3am...' },
            { name: 'Pair Program',  type: 'ghost',   dmg: [11, 17], msg: '4 eyes > 2 eyes!' },
            { name: 'Brute Force',   type: 'fighting', dmg: [20, 32], msg: 'O(n!) complexity...' },
        ],
    },
    {
        id: 'markizard',
        name: 'MARKIZARD',
        base: 'Charizard',
        sprite: `${SHOWDOWN}/gen5ani-back/charizard.gif`,
        spriteFb: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/6.png',
        maxHp: 115, level: 50,
        moves: [
            { name: 'CI/CD Blaze',   type: 'dark',    dmg: [16, 24], msg: 'Pipeline green!' },
            { name: 'Lint Fix',      type: 'bug',     dmg: [12, 18], msg: '0 warnings remaining!' },
            { name: 'Hotfix',        type: 'ghost',   dmg: [14, 20], msg: 'Emergency patch live!' },
            { name: 'Spaghetti',     type: 'psychic', dmg: [19, 31], msg: 'Code: unmaintainable...' },
        ],
    },
    {
        id: 'markstoise',
        name: 'MARKSTOISE',
        base: 'Blastoise',
        sprite: `${SHOWDOWN}/gen5ani-back/blastoise.gif`,
        spriteFb: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/9.png',
        maxHp: 135, level: 50,
        moves: [
            { name: 'Docker Build',  type: 'dark',    dmg: [13, 19], msg: 'Container deployed!' },
            { name: 'Pen Test',      type: 'bug',     dmg: [14, 20], msg: 'Vuln patched!' },
            { name: 'Rollback',      type: 'ghost',   dmg: [11, 17], msg: 'Reverted to v2.3.1!' },
            { name: 'rm -rf /',      type: 'fighting', dmg: [22, 34], msg: 'Everything is gone...' },
        ],
    },
];

const ENEMY = {
    name: 'BUGTWO', maxHp: 110, level: 50,
    sprite: `${SHOWDOWN}/gen5ani/mewtwo.gif`,
    spriteFb: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png',
    moves: [
        { name: 'Null Pointer',   type: 'psychic', dmg: [16, 26], msg: 'Cannot read undefined!' },
        { name: 'Infinite Loop',  type: 'normal',  dmg: [20, 30], msg: 'while(true) {suffer()}' },
        { name: 'Merge Conflict', type: 'dark',    dmg: [18, 32], msg: '<<<<<<< HEAD everywhere!' },
        { name: 'Memory Leak',    type: 'poison',  dmg: [12, 22], msg: 'RAM at 99%...', heal: 10 },
    ],
};

const TYPE_CLR = {
    fire: '#F08030', electric: '#F8D030', psychic: '#F85888', normal: '#A8A878',
    dark: '#705848', poison: '#A040A0', bug: '#A8B820', ghost: '#705898',
    fighting: '#C03028', water: '#6890F0', grass: '#78C850',
};

const roll = ([lo, hi]) => Math.floor(Math.random() * (hi - lo + 1)) + lo;
const NAV = { 0: { right: 1, down: 2 }, 1: { left: 0, down: 3 }, 2: { up: 0, right: 3 }, 3: { up: 1, left: 2 } };

function Sprite({ src, fb, alt, className }) {
    const [bad, setBad] = useState(false);
    return <img src={bad ? fb : src} alt={alt} className={className} style={{ imageRendering: 'pixelated' }} onError={() => setBad(true)} draggable={false} />;
}

function HpBar({ hp, max, name, level, side }) {
    const pct = Math.max(0, (hp / max) * 100);
    const clr = pct > 50 ? '#48D0B0' : pct > 20 ? '#F8D030' : '#F06060';
    return (
        <div className={`absolute z-30 ${side === 'enemy' ? 'left-3 top-3 sm:left-5 sm:top-4' : 'right-3 sm:right-5'}`} style={side === 'player' ? { bottom: '35%' } : undefined}>
            <div className="rounded-sm border border-[#484848] bg-[#f8f0d8] px-2 py-1 shadow sm:px-3.5 sm:py-1.5">
                <div className="flex items-baseline justify-between gap-8 sm:gap-12">
                    <span className="text-[7px] text-[#383838] sm:text-[9px]">{name}</span>
                    <span className="text-[5px] text-[#787878] sm:text-[7px]">Lv{level}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-1.5">
                    <span className="text-[5px] font-bold text-[#F8A800] sm:text-[7px]">HP</span>
                    <div className="h-1.5 w-24 overflow-hidden rounded-[1px] bg-[#383838] sm:h-2 sm:w-32">
                        <div className="h-full transition-all duration-700 ease-out" style={{ width: `${pct}%`, backgroundColor: clr }} />
                    </div>
                </div>
                {side === 'player' && (
                    <p className="mt-px text-right text-[5px] text-[#585858] sm:text-[7px]">{Math.max(0, hp)}<span className="text-[#989898]">/{max}</span></p>
                )}
            </div>
        </div>
    );
}

export function PokemonBattle() {
    const [screen, setScreen] = useState('title');
    const [trainerIdx, setTrainerIdx] = useState(0);
    const [pokemonIdx, setPokemonIdx] = useState(0);
    const [phase, setPhase] = useState('idle');
    const [playerHp, setPlayerHp] = useState(0);
    const [enemyHp, setEnemyHp] = useState(ENEMY.maxHp);
    const [sel, setSel] = useState(0);
    const [msg, setMsg] = useState('');
    const [typed, setTyped] = useState('');
    const [typeDone, setTypeDone] = useState(true);

    const [showTrainer, setShowTrainer] = useState(false);
    const [showEnemy, setShowEnemy] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);
    const [showBall, setShowBall] = useState(false);
    const [flashOn, setFlashOn] = useState(false);
    const [shaking, setShaking] = useState(false);
    const [hitE, setHitE] = useState(false);
    const [hitP, setHitP] = useState(false);
    const [faintE, setFaintE] = useState(false);
    const [faintP, setFaintP] = useState(false);
    const [trainerExit, setTrainerExit] = useState(false);
    const [enemyEnter, setEnemyEnter] = useState(false);
    const [playerEmerge, setPlayerEmerge] = useState(false);

    const chosen = POKEMON[pokemonIdx];
    const trainer = TRAINERS[trainerIdx];

    const pHpRef = useRef(0);
    const eHpRef = useRef(ENEMY.maxHp);
    useEffect(() => { pHpRef.current = playerHp; }, [playerHp]);
    useEffect(() => { eHpRef.current = enemyHp; }, [enemyHp]);

    const tIds = useRef(new Set());
    const t = useCallback((fn, ms) => {
        const id = setTimeout(() => { tIds.current.delete(id); fn(); }, ms);
        tIds.current.add(id);
    }, []);
    useEffect(() => () => tIds.current.forEach(clearTimeout), []);

    useEffect(() => {
        if (!msg) { setTyped(''); setTypeDone(true); return; }
        setTyped(''); setTypeDone(false);
        let i = 0;
        const iv = setInterval(() => {
            i++;
            setTyped(msg.slice(0, i));
            if (i >= msg.length) { clearInterval(iv); setTypeDone(true); }
        }, 45);
        return () => clearInterval(iv);
    }, [msg]);

    const flash = useCallback((ms = 180) => { setFlashOn(true); t(() => setFlashOn(false), ms); }, [t]);
    const shake = useCallback(() => { setShaking(true); t(() => setShaking(false), 300); }, [t]);

    const startBattle = useCallback(() => {
        setScreen('battle');
        setPhase('intro');
        setPlayerHp(chosen.maxHp);
        pHpRef.current = chosen.maxHp;
        setEnemyHp(ENEMY.maxHp);
        eHpRef.current = ENEMY.maxHp;

        for (let i = 0; i < 6; i++) {
            t(() => setFlashOn(true), i * 80);
            t(() => setFlashOn(false), i * 80 + 40);
        }

        t(() => { setShowEnemy(true); setEnemyEnter(true); setMsg('A wild BUGTWO appeared!'); }, 550);
        t(() => { setShowTrainer(true); }, 600);
        t(() => { setMsg(`Go! ${chosen.name}!`); setTrainerExit(true); }, 2800);
        t(() => { setShowBall(true); }, 3200);

        t(() => {
            setShowBall(false);
            flash(250);
            setShowPlayer(true);
            setPlayerEmerge(true);
        }, 4000);

        t(() => { setShowTrainer(false); }, 3600);
        t(() => { setMsg(`What will ${chosen.name} do?`); setPhase('choose'); }, 5200);
    }, [t, flash, chosen]);

    const doAttack = useCallback((idx) => {
        if (phase !== 'choose') return;
        setPhase('animating');
        const mv = chosen.moves[idx];
        const eff = getEff(mv.type);
        const dmg = Math.round(roll(mv.dmg) * eff);
        const newEHp = Math.max(0, eHpRef.current - dmg);

        setMsg(`${chosen.name} used ${mv.name}!`);

        t(() => {
            setHitE(true); shake();
            setEnemyHp(newEHp); eHpRef.current = newEHp;
            t(() => setHitE(false), 500);
        }, 800);

        t(() => {
            if (eff > 1) setMsg("It's super effective!");
            else if (eff < 1) setMsg("It's not very effective...");
            else setMsg(mv.msg);
        }, 1600);

        const effDelay = eff !== 1 ? 1200 : 0;

        t(() => { if (eff !== 1) setMsg(mv.msg); }, effDelay ? 2800 : 0);

        const nextCheck = eff !== 1 ? 3800 : 2800;

        t(() => {
            if (newEHp <= 0) {
                setFaintE(true);
                setMsg('BUGTWO fainted!');
                t(() => { setMsg('You squashed the bug!'); setPhase('win'); }, 2000);
                return;
            }

            const em = ENEMY.moves[Math.floor(Math.random() * ENEMY.moves.length)];
            const ed = roll(em.dmg);
            const newPHp = Math.max(0, pHpRef.current - ed);

            setMsg(`BUGTWO used ${em.name}!`);

            t(() => {
                setHitP(true); shake();
                setPlayerHp(newPHp); pHpRef.current = newPHp;
                if (em.heal) {
                    const h2 = Math.min(ENEMY.maxHp, eHpRef.current + em.heal);
                    setEnemyHp(h2); eHpRef.current = h2;
                }
                t(() => setHitP(false), 500);
            }, 800);

            t(() => setMsg(em.msg), 1600);

            t(() => {
                if (newPHp <= 0) {
                    setFaintP(true);
                    setMsg(`${chosen.name} fainted!`);
                    t(() => { setMsg('The bugs win this time...'); setPhase('lose'); }, 2000);
                    return;
                }
                setMsg(`What will ${chosen.name} do?`);
                setSel(0);
                setPhase('choose');
            }, 2800);
        }, nextCheck);
    }, [phase, t, shake, chosen]);

    const restart = useCallback(() => {
        tIds.current.forEach(clearTimeout);
        tIds.current.clear();
        setScreen('title'); setPhase('idle');
        setPlayerHp(0); setEnemyHp(ENEMY.maxHp);
        pHpRef.current = 0; eHpRef.current = ENEMY.maxHp;
        setSel(0); setMsg(''); setShowEnemy(false); setShowPlayer(false);
        setShowBall(false); setShowTrainer(false); setFaintE(false); setFaintP(false);
        setPlayerEmerge(false); setEnemyEnter(false); setTrainerExit(false);
    }, []);

    useEffect(() => {
        function onKey(e) {
            const k = e.key;
            if (screen === 'title') {
                if (k === 'z' || k === 'Enter') { setScreen('selectTrainer'); return; }
            }
            if (screen === 'selectTrainer') {
                if (k === 'ArrowLeft') { e.preventDefault(); setTrainerIdx(i => (i - 1 + TRAINERS.length) % TRAINERS.length); return; }
                if (k === 'ArrowRight') { e.preventDefault(); setTrainerIdx(i => (i + 1) % TRAINERS.length); return; }
                if (k === 'z' || k === 'Enter') { setScreen('selectPokemon'); return; }
                if (k === 'x' || k === 'Escape') { setScreen('title'); return; }
            }
            if (screen === 'selectPokemon') {
                if (k === 'ArrowLeft') { e.preventDefault(); setPokemonIdx(i => (i - 1 + POKEMON.length) % POKEMON.length); return; }
                if (k === 'ArrowRight') { e.preventDefault(); setPokemonIdx(i => (i + 1) % POKEMON.length); return; }
                if (k === 'z' || k === 'Enter') { startBattle(); return; }
                if (k === 'x' || k === 'Escape') { setScreen('selectTrainer'); return; }
            }
            if (screen === 'battle') {
                if (phase === 'choose') {
                    const dir = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }[k];
                    if (dir && NAV[sel]?.[dir] !== undefined) { e.preventDefault(); setSel(NAV[sel][dir]); return; }
                    if (k === 'z' || k === 'Enter') { doAttack(sel); return; }
                }
                if ((phase === 'win' || phase === 'lose') && (k === 'z' || k === 'Enter')) restart();
                if (k === 'x' || k === 'Escape') { if (phase === 'win' || phase === 'lose') restart(); }
            }
        }
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [screen, phase, sel, startBattle, doAttack, restart]);

    const dpad = useCallback((dir) => {
        if (screen === 'selectTrainer') {
            if (dir === 'left') setTrainerIdx(i => (i - 1 + TRAINERS.length) % TRAINERS.length);
            if (dir === 'right') setTrainerIdx(i => (i + 1) % TRAINERS.length);
        } else if (screen === 'selectPokemon') {
            if (dir === 'left') setPokemonIdx(i => (i - 1 + POKEMON.length) % POKEMON.length);
            if (dir === 'right') setPokemonIdx(i => (i + 1) % POKEMON.length);
        } else if (screen === 'battle' && phase === 'choose') {
            if (NAV[sel]?.[dir] !== undefined) setSel(NAV[sel][dir]);
        }
    }, [screen, phase, sel]);

    const pressA = useCallback(() => {
        if (screen === 'title') setScreen('selectTrainer');
        else if (screen === 'selectTrainer') setScreen('selectPokemon');
        else if (screen === 'selectPokemon') startBattle();
        else if (phase === 'choose') doAttack(sel);
        else if (phase === 'win' || phase === 'lose') restart();
    }, [screen, phase, sel, startBattle, doAttack, restart]);

    const pressB = useCallback(() => {
        if (screen === 'selectTrainer') setScreen('title');
        else if (screen === 'selectPokemon') setScreen('selectTrainer');
        else if (phase === 'win' || phase === 'lose') restart();
    }, [screen, phase, restart]);

    const isOver = phase === 'win' || phase === 'lose';
    const selMove = chosen?.moves[sel];
    const selEff = selMove ? getEff(selMove.type) : 1;

    return (
        <div className={`${gameFont.className} flex min-h-screen flex-col items-center justify-center bg-[#050508] p-4`}>
            <Link href="/" className="fixed left-3 top-3 z-50 font-sans text-[11px] text-neutral-500 no-underline transition-colors hover:text-neutral-200 sm:left-5 sm:top-5 sm:text-sm">
                ← back
            </Link>

            <div className="flex w-full max-w-[480px] flex-col rounded-[30px] bg-gradient-to-b from-[#1e1e32] via-[#18182a] to-[#121220] p-5 shadow-[0_0_100px_-20px_rgba(90,70,180,0.12),0_20px_60px_-20px_rgba(0,0,0,0.6),inset_0_1px_0_0_rgba(255,255,255,0.04)] sm:max-w-[560px] sm:rounded-[36px] sm:p-7">

                <div className="mb-3 flex items-center justify-between px-1 sm:mb-4">
                    <span className="text-[8px] font-bold tracking-[0.25em] text-indigo-400/50 sm:text-[10px]">DEV&nbsp;BOY</span>
                    <div className="flex items-center gap-1.5">
                        <div className={`h-2 w-2 rounded-full transition-colors duration-500 ${screen === 'battle' ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.6)]' : 'bg-red-800/60'}`} />
                    </div>
                </div>

                <div className="overflow-hidden rounded-xl bg-[#080810] p-2 shadow-[inset_0_3px_12px_rgba(0,0,0,0.7)] sm:rounded-2xl sm:p-3">
                    <div className={`relative aspect-[3/2] w-full overflow-hidden rounded-md ${shaking ? 'battle-shake' : ''}`}>
                        <div className="pointer-events-none absolute inset-0 z-50 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.04)_2px,rgba(0,0,0,0.04)_4px)] mix-blend-multiply" />

                        {screen === 'title' && (
                            <div className="relative flex h-full flex-col items-center justify-center overflow-hidden bg-[#0c0c18]" onClick={pressA}>
                                <div className="pointer-events-none absolute inset-0 animate-[titleStarScroll_12s_linear_infinite] bg-[radial-gradient(1px_1px_at_10%_20%,rgba(160,160,255,0.5),transparent),radial-gradient(1px_1px_at_30%_65%,rgba(160,160,255,0.4),transparent),radial-gradient(1px_1px_at_55%_15%,rgba(160,160,255,0.5),transparent),radial-gradient(1px_1px_at_70%_80%,rgba(160,160,255,0.3),transparent),radial-gradient(1px_1px_at_85%_40%,rgba(160,160,255,0.4),transparent),radial-gradient(1.5px_1.5px_at_20%_85%,rgba(200,180,255,0.6),transparent),radial-gradient(1.5px_1.5px_at_45%_45%,rgba(200,180,255,0.5),transparent),radial-gradient(1px_1px_at_65%_55%,rgba(160,160,255,0.4),transparent),radial-gradient(1px_1px_at_90%_10%,rgba(160,160,255,0.5),transparent),radial-gradient(1.5px_1.5px_at_5%_50%,rgba(200,180,255,0.5),transparent)] bg-[length:100%_200%]" />
                                <div className="pointer-events-none absolute -left-[40%] top-[10%] h-[120%] w-[60%] animate-[titleSweep_4s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent" style={{ transform: 'rotate(20deg)' }} />

                                <p className="relative z-10 animate-[titleSlideDown_0.8s_ease-out] text-[12px] leading-relaxed text-indigo-300 sm:text-[15px]" style={{ textShadow: '0 0 12px rgba(129,140,248,0.5)' }}>DEVELOPER</p>
                                <p className="relative z-10 animate-[titleSlideDown_0.8s_ease-out_0.15s_both] text-[12px] leading-relaxed text-indigo-300 sm:text-[15px]" style={{ textShadow: '0 0 12px rgba(129,140,248,0.5)' }}>BATTLE</p>
                                <p className="relative z-10 animate-[titleSlideDown_0.8s_ease-out_0.3s_both] text-[7px] tracking-widest text-neutral-500 sm:text-[8px]">SIMULATOR</p>

                                <div className="relative z-10 my-4 flex items-center gap-4">
                                    <Sprite src={`${SHOWDOWN}/gen5ani/infernape.gif`} fb="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/392.png" alt="" className="h-12 animate-[titleFadeIn_0.6s_ease-out_0.6s_both] sm:h-16" />
                                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="" className="h-8 w-8 animate-[titleSpinIn_0.8s_ease-out_0.5s_both] sm:h-10 sm:w-10" style={{ imageRendering: 'pixelated' }} draggable={false} />
                                    <Sprite src={`${SHOWDOWN}/gen5ani/mewtwo.gif`} fb="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/150.png" alt="" className="h-12 animate-[titleFadeIn_0.6s_ease-out_0.8s_both] sm:h-16" />
                                </div>

                                <p className="relative z-10 animate-[blinkSlow_1.2s_steps(2,start)_infinite] text-[7px] tracking-wider text-neutral-400 sm:text-[8px]">PRESS START</p>
                            </div>
                        )}

                        {screen === 'selectTrainer' && (
                            <div className="flex h-full flex-col items-center justify-center gap-2 bg-[#0c0c18]">
                                <p className="text-[8px] text-indigo-300 sm:text-[10px]">CHOOSE TRAINER</p>
                                <div className="flex items-center gap-6 sm:gap-8">
                                    <button onClick={() => setTrainerIdx(i => (i - 1 + TRAINERS.length) % TRAINERS.length)} className="cursor-pointer border-none bg-transparent text-[14px] text-neutral-500 transition-colors hover:text-indigo-400 active:scale-110 sm:text-[18px]">◄</button>
                                    <div className="flex flex-col items-center gap-1">
                                        <img key={trainer.id} src={trainer.src} alt={trainer.name} className="h-20 w-auto animate-[titleFadeIn_0.2s_ease-out] sm:h-28" style={{ imageRendering: 'pixelated' }} draggable={false} />
                                        <span className="text-[7px] text-neutral-300 sm:text-[9px]">{trainer.name}</span>
                                    </div>
                                    <button onClick={() => setTrainerIdx(i => (i + 1) % TRAINERS.length)} className="cursor-pointer border-none bg-transparent text-[14px] text-neutral-500 transition-colors hover:text-indigo-400 active:scale-110 sm:text-[18px]">►</button>
                                </div>
                                <div className="flex gap-1">
                                    {TRAINERS.map((_, i) => (
                                        <button key={i} onClick={() => setTrainerIdx(i)} className={`h-1.5 w-1.5 cursor-pointer rounded-full border-none transition-colors sm:h-2 sm:w-2 ${i === trainerIdx ? 'bg-indigo-400' : 'bg-neutral-700 hover:bg-neutral-500'}`} />
                                    ))}
                                </div>
                                <p className="mt-1 text-[5px] text-neutral-600 sm:text-[6px]">A:SELECT &nbsp; B:BACK</p>
                            </div>
                        )}

                        {screen === 'selectPokemon' && (
                            <div className="flex h-full flex-col items-center justify-center gap-1 bg-[#0c0c18]">
                                <p className="text-[8px] text-indigo-300 sm:text-[10px]">CHOOSE POKEMON</p>
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <button onClick={() => setPokemonIdx(i => (i - 1 + POKEMON.length) % POKEMON.length)} className="cursor-pointer border-none bg-transparent text-[14px] text-neutral-500 transition-colors hover:text-indigo-400 active:scale-110 sm:text-[18px]">◄</button>
                                    <div className="flex flex-col items-center gap-0.5">
                                        <Sprite
                                            key={pokemonIdx}
                                            src={`${SHOWDOWN}/gen5ani/${POKEMON[pokemonIdx].base.toLowerCase()}.gif`}
                                            fb={POKEMON[pokemonIdx].spriteFb}
                                            alt={POKEMON[pokemonIdx].name}
                                            className="h-20 w-auto animate-[titleFadeIn_0.2s_ease-out] sm:h-28"
                                        />
                                        <span className="text-[7px] text-neutral-300 sm:text-[9px]">{POKEMON[pokemonIdx].name}</span>
                                        <span className="text-[5px] text-neutral-500 sm:text-[6px]">HP {POKEMON[pokemonIdx].maxHp}</span>
                                    </div>
                                    <button onClick={() => setPokemonIdx(i => (i + 1) % POKEMON.length)} className="cursor-pointer border-none bg-transparent text-[14px] text-neutral-500 transition-colors hover:text-indigo-400 active:scale-110 sm:text-[18px]">►</button>
                                </div>
                                <div className="mt-1 flex flex-wrap justify-center gap-1 px-8">
                                    {POKEMON[pokemonIdx].moves.map((m) => {
                                        const e = getEff(m.type);
                                        return (
                                            <span key={m.name} className="rounded-sm px-1.5 py-0.5 text-[5px] sm:text-[6px]" style={{ backgroundColor: `${TYPE_CLR[m.type]}33`, color: TYPE_CLR[m.type] }}>
                                                {m.name} {e > 1 ? '★' : e < 1 ? '✗' : ''}
                                            </span>
                                        );
                                    })}
                                </div>
                                <div className="mt-1 flex gap-1">
                                    {POKEMON.map((_, i) => (
                                        <button key={i} onClick={() => setPokemonIdx(i)} className={`h-1.5 w-1.5 cursor-pointer rounded-full border-none transition-colors sm:h-2 sm:w-2 ${i === pokemonIdx ? 'bg-indigo-400' : 'bg-neutral-700 hover:bg-neutral-500'}`} />
                                    ))}
                                </div>
                                <p className="mt-1 text-[5px] text-neutral-600 sm:text-[6px]">A:FIGHT &nbsp; B:BACK</p>
                            </div>
                        )}

                        {screen === 'battle' && (
                            <>
                                <div className="absolute inset-0">
                                    <div className="absolute inset-0 bg-gradient-to-b from-[#70B8F8] via-[#98D0F0] to-[#B8E0A8]" />
                                    <div className="absolute bottom-0 left-0 right-0 h-[42%] bg-gradient-to-b from-[#78B858] to-[#60A040]" />
                                </div>

                                <div className="absolute right-[4%] top-[30%] h-[8%] w-[42%] rounded-[50%] bg-gradient-to-b from-[#90C878] to-[#68A050] shadow-[0_2px_0_#507040]" />
                                <div className="absolute -left-[2%] bottom-[26%] h-[10%] w-[50%] rounded-[50%] bg-gradient-to-b from-[#80B860] to-[#58883C] shadow-[0_3px_0_#406830]" />

                                {showEnemy && <HpBar hp={enemyHp} max={ENEMY.maxHp} name={ENEMY.name} level={ENEMY.level} side="enemy" />}
                                {showPlayer && <HpBar hp={playerHp} max={chosen.maxHp} name={chosen.name} level={chosen.level} side="player" />}

                                {showTrainer && (
                                    <div className={`absolute bottom-[28%] left-[5%] z-10 ${trainerExit ? 'animate-[trainerSlideOut_0.8s_ease-in_forwards]' : 'animate-[trainerSlideIn_0.5s_ease-out]'}`}>
                                        <img src={trainer.src} alt="Trainer" className="h-24 w-auto sm:h-32" style={{ imageRendering: 'pixelated' }} draggable={false} />
                                    </div>
                                )}

                                {showEnemy && (
                                    <div className={`absolute right-[10%] top-[6%] z-10 ${enemyEnter ? 'animate-[enemySlideIn_0.7s_ease-out]' : ''} ${hitE ? 'battle-hit' : ''} ${faintE ? 'battle-faint' : ''}`}>
                                        <Sprite src={ENEMY.sprite} fb={ENEMY.spriteFb} alt={ENEMY.name} className="h-20 w-auto sm:h-28" />
                                    </div>
                                )}

                                {showBall && (
                                    <div className="absolute bottom-[40%] left-[18%] z-20 animate-[pokeballArc_0.8s_ease-out_forwards]">
                                        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png" alt="" className="h-5 w-5 sm:h-7 sm:w-7" style={{ imageRendering: 'pixelated' }} draggable={false} />
                                    </div>
                                )}

                                {showPlayer && (
                                    <div className={`absolute bottom-[28%] left-[6%] z-10 ${playerEmerge ? 'animate-[spriteEmerge_0.5s_ease-out]' : ''} ${hitP ? 'battle-hit' : ''} ${faintP ? 'battle-faint' : ''}`}>
                                        <Sprite src={chosen.sprite} fb={chosen.spriteFb} alt={chosen.name} className="h-24 w-auto sm:h-32" />
                                    </div>
                                )}

                                {flashOn && <div className="absolute inset-0 z-40 bg-white animate-[flashPulse_0.18s_ease-out]" />}

                                <div className="absolute bottom-0 left-0 right-0 z-30 h-[30%] border-t-[3px] border-[#484848] bg-[#f8f0d8]">
                                    {phase === 'choose' ? (
                                        <div className="flex h-full">
                                            <div className="flex w-[36%] flex-col justify-center border-r-[2px] border-[#484848] px-2 sm:px-3">
                                                <p className="text-[6px] leading-relaxed text-[#383838] sm:text-[8px]">
                                                    What will<br />{chosen.name}<br />do?
                                                </p>
                                                {selEff !== 1 && (
                                                    <p className={`mt-1 text-[5px] sm:text-[6px] ${selEff > 1 ? 'text-green-700' : 'text-red-700'}`}>
                                                        {selEff > 1 ? '★ super effective' : '✗ not effective'}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="grid flex-1 grid-cols-2 grid-rows-2">
                                                {chosen.moves.map((m, i) => {
                                                    const e = getEff(m.type);
                                                    return (
                                                        <button
                                                            key={m.name}
                                                            type="button"
                                                            onClick={() => doAttack(i)}
                                                            onMouseEnter={() => setSel(i)}
                                                            className={`flex items-center gap-0.5 px-1.5 text-left transition-colors sm:px-2 ${sel === i ? 'bg-[#e8e0c0]' : 'bg-[#f8f0d8] hover:bg-[#f0e8d0]'}`}
                                                        >
                                                            <span className="text-[6px] text-[#383838] sm:text-[8px]">
                                                                {sel === i ? '►' : '\u00A0'} {m.name}
                                                            </span>
                                                            {e > 1 && <span className="text-[5px] text-green-700 sm:text-[6px]">★</span>}
                                                            {e < 1 && <span className="text-[5px] text-red-700 sm:text-[6px]">✗</span>}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ) : isOver ? (
                                        <div className="flex h-full flex-col justify-center gap-1.5 px-3 sm:px-4">
                                            <p className="text-[7px] leading-relaxed text-[#383838] sm:text-[9px]">{typed}</p>
                                            <div className="flex gap-4">
                                                <span className="text-[5px] text-[#787878] sm:text-[7px]">A:REMATCH</span>
                                                <span className="text-[5px] text-[#787878] sm:text-[7px]">B:EXIT</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex h-full items-center px-3 sm:px-4">
                                            <p className="text-[7px] leading-relaxed text-[#383838] sm:text-[9px]">
                                                {typed}
                                                {typeDone && <span className="ml-1 inline-block animate-[blinkSlow_0.8s_steps(2,start)_infinite]">▼</span>}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="mt-7 flex items-start justify-between px-2 sm:mt-8 sm:px-5">
                    <div className="relative h-[84px] w-[84px] select-none sm:h-[100px] sm:w-[100px]">
                        <div className="absolute left-1/2 top-0 h-full w-[32%] -translate-x-1/2 rounded-[4px] bg-[#28283e] shadow-[inset_0_-2px_6px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.04)]" />
                        <div className="absolute left-0 top-1/2 h-[32%] w-full -translate-y-1/2 rounded-[4px] bg-[#28283e] shadow-[inset_0_-2px_6px_rgba(0,0,0,0.5),0_1px_0_rgba(255,255,255,0.04)]" />
                        <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#1c1c2c]" />
                        <span className="pointer-events-none absolute left-1/2 top-[5%] -translate-x-1/2 text-[8px] text-[#3a3a5a]">▲</span>
                        <span className="pointer-events-none absolute bottom-[5%] left-1/2 -translate-x-1/2 text-[8px] text-[#3a3a5a]">▼</span>
                        <span className="pointer-events-none absolute left-[6%] top-1/2 -translate-y-1/2 text-[8px] text-[#3a3a5a]">◄</span>
                        <span className="pointer-events-none absolute right-[6%] top-1/2 -translate-y-1/2 text-[8px] text-[#3a3a5a]">►</span>
                        <button type="button" onClick={() => dpad('up')} className="absolute left-[34%] top-0 h-[32%] w-[32%] cursor-pointer rounded-t-[4px] opacity-0 active:opacity-10 active:bg-white" aria-label="Up" />
                        <button type="button" onClick={() => dpad('down')} className="absolute bottom-0 left-[34%] h-[32%] w-[32%] cursor-pointer rounded-b-[4px] opacity-0 active:opacity-10 active:bg-white" aria-label="Down" />
                        <button type="button" onClick={() => dpad('left')} className="absolute left-0 top-[34%] h-[32%] w-[32%] cursor-pointer rounded-l-[4px] opacity-0 active:opacity-10 active:bg-white" aria-label="Left" />
                        <button type="button" onClick={() => dpad('right')} className="absolute right-0 top-[34%] h-[32%] w-[32%] cursor-pointer rounded-r-[4px] opacity-0 active:opacity-10 active:bg-white" aria-label="Right" />
                    </div>

                    <div className="flex flex-col items-center gap-2 pt-10">
                        <div className="flex gap-5">
                            <button type="button" className="h-2 w-10 cursor-pointer rounded-full bg-[#38384e] shadow-[inset_0_-1px_2px_rgba(0,0,0,0.5)] active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.7)] sm:w-12" aria-label="Select" />
                            <button type="button" onClick={pressA} className="h-2 w-10 cursor-pointer rounded-full bg-[#38384e] shadow-[inset_0_-1px_2px_rgba(0,0,0,0.5)] active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.7)] sm:w-12" aria-label="Start" />
                        </div>
                        <div className="flex gap-5">
                            <span className="text-[4px] tracking-[0.15em] text-neutral-600 sm:text-[5px]">SELECT</span>
                            <span className="text-[4px] tracking-[0.15em] text-neutral-600 sm:text-[5px]">START</span>
                        </div>
                    </div>

                    <div className="relative h-[84px] w-[84px] select-none sm:h-[100px] sm:w-[100px]">
                        <button
                            type="button"
                            onClick={pressB}
                            className="absolute bottom-1 left-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#7B3052] shadow-[inset_0_-3px_6px_rgba(0,0,0,0.4),0_2px_6px_rgba(0,0,0,0.4)] transition-all active:translate-y-[1px] active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] sm:h-12 sm:w-12"
                            aria-label="B button"
                        >
                            <span className="text-[8px] font-bold text-white/60 sm:text-[9px]">B</span>
                        </button>
                        <button
                            type="button"
                            onClick={pressA}
                            className="absolute right-0 top-1 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#7B3052] shadow-[inset_0_-3px_6px_rgba(0,0,0,0.4),0_2px_6px_rgba(0,0,0,0.4)] transition-all active:translate-y-[1px] active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.6)] sm:h-12 sm:w-12"
                            aria-label="A button"
                        >
                            <span className="text-[8px] font-bold text-white/60 sm:text-[9px]">A</span>
                        </button>
                        <span className="absolute bottom-0 left-4 text-[4px] text-neutral-600 sm:text-[5px]">B</span>
                        <span className="absolute right-4 top-0 text-[4px] text-neutral-600 sm:text-[5px]">A</span>
                    </div>
                </div>

                <div className="mt-5 flex items-end justify-end gap-[3px] px-4 sm:mt-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="w-[2px] rounded-full bg-neutral-700/30" style={{ height: `${10 + Math.sin(i * 0.7) * 5}px`, transform: 'rotate(-30deg)' }} />
                    ))}
                </div>
            </div>

            <p className="mt-4 text-center font-sans text-[10px] leading-relaxed text-neutral-700 sm:text-xs">
                Arrows = D-Pad &nbsp;·&nbsp; Z/Enter = A &nbsp;·&nbsp; X/Esc = B
            </p>
        </div>
    );
}
