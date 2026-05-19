"use client";

import { useState, useCallback, type MutableRefObject } from "react";
import { type SkillGraphParams, defaultParams } from "@/components/SkillGraph";

function Slider({
  label,
  value,
  min,
  max,
  step = 0.001,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-1">
      <div className="flex items-center justify-between">
        <label className="text-[10px] text-gray-400 truncate mr-1">{label}</label>
        <span className="text-[10px] text-gray-200 tabular-nums w-16 text-right">
          {Number.isInteger(value) ? value : value.toFixed(3)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 accent-purple-500 cursor-pointer"
      />
    </div>
  );
}

function Section({
  title,
  keys,
  paramsRef,
  onChanged,
  children,
}: {
  title: string;
  keys: (keyof SkillGraphParams)[];
  paramsRef: MutableRefObject<SkillGraphParams>;
  onChanged: () => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  const handleCopySection = () => {
    const subset: Record<string, unknown> = {};
    const p = paramsRef.current;
    for (const k of keys) subset[k] = p[k];
    navigator.clipboard.writeText(JSON.stringify(subset, null, 2));
  };

  const handleResetSection = () => {
    const p = paramsRef.current;
    for (const k of keys) (p as Record<string, unknown>)[k] = (defaultParams as Record<string, unknown>)[k];
    onChanged();
  };

  return (
    <div className="mb-2">
      <div className="flex items-center justify-between border-b border-purple-900/30 mb-1 py-0.5">
        <button onClick={() => setOpen(!open)} className="text-left text-[11px] font-semibold text-purple-300">
          {open ? "\u25bc" : "\u25b6"} {title}
        </button>
        <div className="flex gap-0.5">
          <button onClick={handleCopySection} className="rounded bg-green-800 px-1.5 py-px text-[8px] text-green-200 hover:bg-green-700" title={`Copy ${title}`}>C</button>
          <button onClick={handleResetSection} className="rounded bg-red-900 px-1.5 py-px text-[8px] text-red-200 hover:bg-red-800" title={`Reset ${title}`}>R</button>
        </div>
      </div>
      {open && children}
    </div>
  );
}

const PHYSICS_KEYS: (keyof SkillGraphParams)[] = ["velocityDecay", "categoryStrength", "collisionRadius", "collisionIterations", "centeringStrength"];
const LINKS_KEYS: (keyof SkillGraphParams)[] = ["linkStrength", "linkDistance"];
const MOUSE_KEYS: (keyof SkillGraphParams)[] = ["mouseRepulsionRadius", "explosiveRepulsionStrength"];
const LAYOUT_KEYS: (keyof SkillGraphParams)[] = ["maxRadiusMultiplier", "innerRingFactor", "outerRingFactor", "clusterRadiusMax", "clusterRadiusBase", "clusterRadiusScale"];
const BUBBLE_KEYS: (keyof SkillGraphParams)[] = ["bubblePadding", "bubbleMaxExpansionFactor", "bubbleMinRadius", "bubbleFillAlpha", "bubbleStrokeAlpha", "bubbleStrokeWidth"];
const NODE_KEYS: (keyof SkillGraphParams)[] = ["nodeBaseSize", "nodeRatingScale", "nodeGlowRadius", "nodeLabelFontSize", "nodeLabelTruncate", "nodeLabelTextAlpha"];
const CONN_KEYS: (keyof SkillGraphParams)[] = ["connectionMaxDist", "connectionBaseAlpha", "connectionWidth"];
const CATLABEL_KEYS: (keyof SkillGraphParams)[] = ["catLabelFontSize", "catLabelLineLength", "catLabelDotRadius"];
const LEO_KEYS: (keyof SkillGraphParams)[] = ["leoSize", "leoSizeHovered", "leoGlowLayers"];

export function SkillGraphDebug({
  paramsRef,
  rebuildSignalRef,
}: {
  paramsRef: MutableRefObject<SkillGraphParams>;
  rebuildSignalRef: MutableRefObject<number>;
}) {
  const [open, setOpen] = useState(false);
  const [p, setP] = useState<SkillGraphParams>(() => ({ ...paramsRef.current }));

  const setParam = useCallback(
    <K extends keyof SkillGraphParams>(key: K, value: SkillGraphParams[K]) => {
      setP((prev) => {
        const next = { ...prev, [key]: value };
        paramsRef.current = next;
        return next;
      });
      if ((LAYOUT_KEYS as string[]).includes(key)) {
        rebuildSignalRef.current += 1;
      }
    },
    [paramsRef, rebuildSignalRef]
  );

  const handleRebuild = () => {
    rebuildSignalRef.current += 1;
    setP({ ...paramsRef.current });
  };

  const handleResetAll = () => {
    paramsRef.current = { ...defaultParams };
    setP({ ...defaultParams });
    rebuildSignalRef.current += 1;
  };

  const handleCopyAll = () => {
    navigator.clipboard.writeText(JSON.stringify(paramsRef.current, null, 2));
  };

  const triggerRerender = () => setP({ ...paramsRef.current });

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-purple-700 px-3 py-1.5 text-xs font-bold text-white shadow-lg hover:bg-purple-600"
      >
        {open ? "Debug x" : "Debug"}
      </button>

      {open && (
        <div className="fixed bottom-12 right-4 z-50 max-h-[82vh] w-80 overflow-y-auto rounded-lg border border-purple-900/50 bg-gray-950/95 p-3 shadow-2xl backdrop-blur">
          <div className="mb-2 flex gap-1">
            <button onClick={handleCopyAll} className="flex-1 rounded bg-green-700 px-2 py-1 text-[10px] font-bold text-white hover:bg-green-600">Copy All</button>
            <button onClick={handleResetAll} className="flex-1 rounded bg-red-800 px-2 py-1 text-[10px] font-bold text-white hover:bg-red-700">Reset All</button>
            <button onClick={handleRebuild} className="flex-1 rounded bg-blue-700 px-2 py-1 text-[10px] font-bold text-white hover:bg-blue-600">Rebuild</button>
          </div>

          <Section title="Physics" keys={PHYSICS_KEYS} paramsRef={paramsRef} onChanged={triggerRerender}>
            <Slider label="Velocity Decay" value={p.velocityDecay} min={0} max={0.99} step={0.01} onChange={(v) => setParam("velocityDecay", v)} />
            <Slider label="Category Strength" value={p.categoryStrength} min={0} max={0.5} step={0.001} onChange={(v) => setParam("categoryStrength", v)} />
            <Slider label="Collision Radius" value={p.collisionRadius} min={0} max={100} step={0.5} onChange={(v) => setParam("collisionRadius", v)} />
            <Slider label="Collision Iterations" value={p.collisionIterations} min={0} max={10} step={1} onChange={(v) => setParam("collisionIterations", v)} />
            <Slider label="Centering Strength" value={p.centeringStrength} min={0} max={0.1} step={0.0001} onChange={(v) => setParam("centeringStrength", v)} />
          </Section>

          <Section title="Links" keys={LINKS_KEYS} paramsRef={paramsRef} onChanged={triggerRerender}>
            <Slider label="Strength" value={p.linkStrength} min={0} max={5} step={0.01} onChange={(v) => setParam("linkStrength", v)} />
            <Slider label="Distance" value={p.linkDistance} min={0} max={1000} step={5} onChange={(v) => setParam("linkDistance", v)} />
          </Section>

          <Section title="Mouse" keys={MOUSE_KEYS} paramsRef={paramsRef} onChanged={triggerRerender}>
            <Slider label="Repulsion Radius" value={p.mouseRepulsionRadius} min={0} max={800} step={10} onChange={(v) => setParam("mouseRepulsionRadius", v)} />
            <Slider label="Explosive Strength" value={p.explosiveRepulsionStrength} min={0} max={200} step={1} onChange={(v) => setParam("explosiveRepulsionStrength", v)} />
          </Section>

          <Section title="Layout" keys={LAYOUT_KEYS} paramsRef={paramsRef} onChanged={triggerRerender}>
            <Slider label="Max Radius Mult" value={p.maxRadiusMultiplier} min={0} max={1.5} step={0.01} onChange={(v) => { setParam("maxRadiusMultiplier", v); }} />
            <Slider label="Inner Ring Factor" value={p.innerRingFactor} min={0} max={1.5} step={0.01} onChange={(v) => { setParam("innerRingFactor", v); }} />
            <Slider label="Outer Ring Factor" value={p.outerRingFactor} min={0} max={1.5} step={0.01} onChange={(v) => { setParam("outerRingFactor", v); }} />
            <Slider label="Cluster Radius Max" value={p.clusterRadiusMax} min={0} max={500} step={5} onChange={(v) => { setParam("clusterRadiusMax", v); }} />
            <Slider label="Cluster Radius Base" value={p.clusterRadiusBase} min={0} max={200} step={1} onChange={(v) => { setParam("clusterRadiusBase", v); }} />
            <Slider label="Cluster Radius Scale" value={p.clusterRadiusScale} min={0} max={15} step={0.1} onChange={(v) => { setParam("clusterRadiusScale", v); }} />
          </Section>

          <Section title="Bubbles" keys={BUBBLE_KEYS} paramsRef={paramsRef} onChanged={triggerRerender}>
            <Slider label="Padding" value={p.bubblePadding} min={0} max={80} step={1} onChange={(v) => setParam("bubblePadding", v)} />
            <Slider label="Max Expansion" value={p.bubbleMaxExpansionFactor} min={0} max={8} step={0.1} onChange={(v) => setParam("bubbleMaxExpansionFactor", v)} />
            <Slider label="Min Radius" value={p.bubbleMinRadius} min={0} max={300} step={5} onChange={(v) => setParam("bubbleMinRadius", v)} />
            <Slider label="Fill Alpha" value={p.bubbleFillAlpha} min={0} max={0.8} step={0.01} onChange={(v) => setParam("bubbleFillAlpha", v)} />
            <Slider label="Stroke Alpha" value={p.bubbleStrokeAlpha} min={0} max={1} step={0.01} onChange={(v) => setParam("bubbleStrokeAlpha", v)} />
            <Slider label="Stroke Width" value={p.bubbleStrokeWidth} min={0} max={10} step={0.1} onChange={(v) => setParam("bubbleStrokeWidth", v)} />
          </Section>

          <Section title="Nodes" keys={NODE_KEYS} paramsRef={paramsRef} onChanged={triggerRerender}>
            <Slider label="Base Size" value={p.nodeBaseSize} min={0} max={30} step={0.1} onChange={(v) => setParam("nodeBaseSize", v)} />
            <Slider label="Rating Scale" value={p.nodeRatingScale} min={0} max={6} step={0.1} onChange={(v) => setParam("nodeRatingScale", v)} />
            <Slider label="Glow Radius" value={p.nodeGlowRadius} min={0} max={40} step={0.5} onChange={(v) => setParam("nodeGlowRadius", v)} />
            <Slider label="Label Font Size" value={p.nodeLabelFontSize} min={0} max={24} step={0.5} onChange={(v) => setParam("nodeLabelFontSize", v)} />
            <Slider label="Label Truncate" value={p.nodeLabelTruncate} min={2} max={50} step={1} onChange={(v) => setParam("nodeLabelTruncate", v)} />
            <Slider label="Label Text Alpha" value={p.nodeLabelTextAlpha} min={0} max={1} step={0.01} onChange={(v) => setParam("nodeLabelTextAlpha", v)} />
          </Section>

          <Section title="Connections" keys={CONN_KEYS} paramsRef={paramsRef} onChanged={triggerRerender}>
            <Slider label="Max Distance" value={p.connectionMaxDist} min={0} max={500} step={5} onChange={(v) => setParam("connectionMaxDist", v)} />
            <Slider label="Base Alpha" value={p.connectionBaseAlpha} min={0} max={1} step={0.01} onChange={(v) => setParam("connectionBaseAlpha", v)} />
            <Slider label="Width" value={p.connectionWidth} min={0} max={8} step={0.1} onChange={(v) => setParam("connectionWidth", v)} />
          </Section>

          <Section title="Cat Labels" keys={CATLABEL_KEYS} paramsRef={paramsRef} onChanged={triggerRerender}>
            <Slider label="Font Size" value={p.catLabelFontSize} min={0} max={24} step={0.5} onChange={(v) => setParam("catLabelFontSize", v)} />
            <Slider label="Line Length" value={p.catLabelLineLength} min={0} max={100} step={1} onChange={(v) => setParam("catLabelLineLength", v)} />
            <Slider label="Dot Radius" value={p.catLabelDotRadius} min={0} max={15} step={0.5} onChange={(v) => setParam("catLabelDotRadius", v)} />
          </Section>

          <Section title="Leo" keys={LEO_KEYS} paramsRef={paramsRef} onChanged={triggerRerender}>
            <Slider label="Size" value={p.leoSize} min={0} max={80} step={1} onChange={(v) => setParam("leoSize", v)} />
            <Slider label="Size Hovered" value={p.leoSizeHovered} min={0} max={100} step={1} onChange={(v) => setParam("leoSizeHovered", v)} />
            <Slider label="Glow Layers" value={p.leoGlowLayers} min={0} max={10} step={1} onChange={(v) => setParam("leoGlowLayers", v)} />
          </Section>
        </div>
      )}
    </>
  );
}
