"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSolutions } from "@/components/gtoc/solutions/useSolutions";
import { usePlanetStore } from "@/components/gtoc/stores/planetStore";
import type { Solution } from "@/components/gtoc/solutions/types";
import ColorPickerPortal from "./ColorPickerPortal";
import BodyListPanel from "./BodyListPanel";
import { useMovieStore } from "@/components/gtoc/stores/useMovieStore";
import { enterFullscreen, toggleFullscreen, isFullscreen, getDefaultFullscreenTarget } from "@/components/gtoc/utils/fullscreen";
import {
  RibbonBrand,
  RibbonChip,
  RibbonCollapseButton,
  RibbonContent,
  RibbonField,
  RibbonGroup,
  RibbonHeader,
  RibbonInline,
  RibbonLargeButton,
  RibbonList,
  RibbonListItem,
  RibbonRoot,
  RibbonShell,
  RibbonSmallButton,
  RibbonStack,
  RibbonStrip,
  RibbonTab,
  RibbonTabs,
  RibbonTwoRow,
} from "./RibbonPrimitives";

type TabKey = "solutions" | "view" | "movie";

function IconImport() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="M7 10l5 5 5-5" /><path d="M12 15V3" /></svg>;
}
function IconSave() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><path d="M17 21v-8H7v8" /><path d="M7 3v5h8" /></svg>;
}
function IconFullscreen() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M8 3H3v5" /><path d="M16 3h5v5" /><path d="M3 16v5h5" /><path d="M21 16v5h-5" /></svg>;
}
function IconExit() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>;
}
function IconVisible() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12Z" /><circle cx="12" cy="12" r="3" /></svg>;
}
function IconHidden() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" /><path d="M1 1l22 22" /></svg>;
}
function IconPath() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 17c1.5-3 4-5 7-5s4.5-4 8-5" /><circle cx="4" cy="17" r="2" /><circle cx="11" cy="12" r="2" /><circle cx="19" cy="7" r="2" /></svg>;
}
function IconDelete() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>;
}
function IconMovie() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="2" y="2" width="20" height="20" rx="2.2" /><path d="M7 2v20" /><path d="M17 2v20" /><path d="M2 12h20" /></svg>;
}
function IconLogo() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m17 8-5-5-5 5" /><path d="M12 3v12" /></svg>;
}
function IconText() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M4 7V4h16v3" /><path d="M12 4v16" /><path d="M9 20h6" /></svg>;
}
function IconKeyframeAdd() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="12" r="10" /><path d="M12 8v8" /><path d="M8 12h8" /></svg>;
}
function IconKeyframeUpdate() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" /><path d="M16 21h5v-5" /></svg>;
}
function IconTrash() {
  return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>;
}
function IconOrbits() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="9" /><path d="M12 3a9 9 0 0 1 9 9" strokeDasharray="4 4" /></svg>;
}
function IconCenter() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="4" /><path d="M3 12h2" /><path d="M19 12h2" /><path d="M12 3v2" /><path d="M12 19v2" /></svg>;
}
function IconBodies() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z" /></svg>;
}
function IconPresentation() {
  return <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="m21 3-7 7" /><path d="m3 21 7-7" /></svg>;
}
function IconAlignLeft() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 6H3" /><path d="M14 12H3" /><path d="M21 18H3" /></svg>;
}
function IconAlignCenter() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 6H3" /><path d="M18 12H6" /><path d="M21 18H3" /></svg>;
}
function IconAlignRight() {
  return <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 6H3" /><path d="M21 12H10" /><path d="M21 18H3" /></svg>;
}

const ASPECT_PRESETS = [
  { label: "16:9", value: 16 / 9 },
  { label: "4:3", value: 4 / 3 },
  { label: "2.35", value: 2.35 },
  { label: "1:1", value: 1 },
];

export default function Ribbon({
  onSave,
  onExit,
  onMakeMovie,
  isSaving,
}: {
  onSave?: () => void;
  onExit?: () => void;
  onMakeMovie?: () => void;
  isSaving?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("solutions");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [fullscreenActive, setFullscreenActive] = useState(false);
  const [openPicker, setOpenPicker] = useState<string | null>(null);
  const [openTextPicker, setOpenTextPicker] = useState(false);
  const [showBodyPanel, setShowBodyPanel] = useState(false);

  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const textColorBtnRef = useRef<HTMLButtonElement>(null);
  const bodyPanelBtnRef = useRef<HTMLButtonElement>(null);

  const {
    solutions,
    visible,
    importSolution,
    toggle,
    deleteSolution,
    recolorSolution,
    updateSolution,
    integratorSteps,
    setIntegratorSteps,
    repropagateAll,
  } = useSolutions();

  const {
    planets = [],
    selectedBodies = [],
    centerBodyId,
    togglePlanet,
    updatePlanetColor,
    updatePlanetTypeColor,
    setCenterBody,
    showOrbits,
    toggleShowOrbits,
  } = usePlanetStore();

  const movieState = useMovieStore();
  const {
    isMovieMode,
    logos,
    aspectRatio,
    keyframes,
    nearbyKeyframeId,
    isPresentationMode,
    textBoxes,
    selectedTextBoxId,
    toggleMovieMode,
    addLogo,
    addTextBox,
    updateTextBox,
    triggerKeyframeCapture,
    removeKeyframe,
    clearKeyframes,
    setAspectRatio,
    togglePresentationMode,
  } = movieState;

  const selectedTextBox = useMemo(
    () => textBoxes.find((t) => t.id === selectedTextBoxId) ?? null,
    [textBoxes, selectedTextBoxId]
  );

  useEffect(() => {
    const handleFs = () => {
      const active = isFullscreen();
      setFullscreenActive(active);
      if (active) setIsCollapsed(true);
    };

    handleFs();
    document.addEventListener("fullscreenchange", handleFs as EventListener);
    document.addEventListener("webkitfullscreenchange", handleFs as EventListener);
    document.addEventListener("mozfullscreenchange", handleFs as EventListener);
    document.addEventListener("MSFullscreenChange", handleFs as EventListener);

    return () => {
      document.removeEventListener("fullscreenchange", handleFs as EventListener);
      document.removeEventListener("webkitfullscreenchange", handleFs as EventListener);
      document.removeEventListener("mozfullscreenchange", handleFs as EventListener);
      document.removeEventListener("MSFullscreenChange", handleFs as EventListener);
    };
  }, []);

  if (isPresentationMode) return null;

  const totalSolutions = solutions.length;
  const visibleSolutions = solutions.filter((s) => visible[s.id]).length;
  const screenRatio = typeof window !== "undefined" ? window.screen.width / window.screen.height : aspectRatio;
  const screenRatioLabel = typeof window !== "undefined" ? `${Math.round(window.screen.width)}×${Math.round(window.screen.height)}` : "Display";

  const handleUploadLogo = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) addLogo(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <RibbonRoot>
      <RibbonShell>
        <RibbonHeader>
          <RibbonBrand
            logoSrc="/vectra.svg"
            logoAlt="Vectra Logo"
            sectionName={
              activeTab === "solutions"
                ? "Trajectory tools"
                : activeTab === "view"
                  ? "Scene tools"
                  : "Presentation tools"
            }
          />

          <div className="flex min-w-0 items-center gap-3">
            <RibbonTabs>
              <RibbonTab active={activeTab === "solutions"} label="Solutions" onClick={() => { setActiveTab("solutions"); setIsCollapsed(false); }} />
              <RibbonTab active={activeTab === "view"} label="View" onClick={() => { setActiveTab("view"); setIsCollapsed(false); }} />
              <RibbonTab active={activeTab === "movie"} label="Movie" onClick={() => { setActiveTab("movie"); setIsCollapsed(false); }} />
            </RibbonTabs>

            <RibbonChip label="Visible" value={`${visibleSolutions}/${totalSolutions || 0}`} />
            <RibbonChip label="Integrator" value={integratorSteps} />
            <RibbonChip label="Movie" value={isMovieMode ? "On" : "Off"} />
            <RibbonCollapseButton collapsed={isCollapsed} onClick={() => setIsCollapsed((v) => !v)} />
          </div>
        </RibbonHeader>

        <RibbonContent collapsed={isCollapsed}>
          {activeTab === "solutions" && (
            <RibbonStrip>
              <RibbonGroup title="Project">
                <RibbonInline className="gap-0.5">
                  <RibbonLargeButton label="Import" meta="Trajectory" icon={<IconImport />} asLabel>
                    <input
                      type="file"
                      accept=".txt"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) importSolution(f);
                        e.target.value = "";
                      }}
                    />
                  </RibbonLargeButton>
                  <RibbonLargeButton label={isSaving ? "Saving" : "Save"} meta="Project" icon={<IconSave />} onClick={onSave} disabled={!!isSaving} active={!!isSaving} />
                  <RibbonLargeButton
                    label="Fullscreen"
                    meta={fullscreenActive ? "Active" : "Canvas"}
                    icon={<IconFullscreen />}
                    onClick={async () => {
                      const target = getDefaultFullscreenTarget();
                      await toggleFullscreen(target);
                    }}
                    active={fullscreenActive}
                  />
                  <RibbonLargeButton label="Exit" meta="Dashboard" icon={<IconExit />} onClick={onExit} />
                </RibbonInline>
              </RibbonGroup>

              <RibbonGroup title="Propagation">
                <RibbonInline className="w-[390px]">
                  <RibbonField label="Adaptive detail" value={integratorSteps} className="min-w-[250px] flex-1">
                    <input
                      type="range"
                      min="20"
                      max="1200"
                      step="10"
                      value={integratorSteps}
                      onChange={(e) => setIntegratorSteps(parseInt(e.target.value, 10))}
                      onMouseUp={() => repropagateAll()}
                      onTouchEnd={() => repropagateAll()}
                      className="ribbon-range w-full cursor-pointer appearance-none bg-transparent"
                    />
                  </RibbonField>
                  <RibbonSmallButton onClick={() => repropagateAll()} className="min-w-[110px]">
                    Recompute now
                  </RibbonSmallButton>
                </RibbonInline>
              </RibbonGroup>

              <RibbonGroup title="Loaded Solutions" className="min-w-[460px]">
                <RibbonList>
                  {solutions.map((s: Solution) => (
                    <RibbonListItem key={s.id}>
                      <button
                        ref={(el) => { btnRefs.current[s.id] = el; }}
                        onClick={() => setOpenPicker(openPicker === s.id ? null : s.id)}
                        className="h-3.5 w-3.5 rounded-full border border-white/40"
                        style={{ backgroundColor: s.color }}
                        title="Change solution color"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[12px] font-medium text-white">{s.name}</div>
                        <div className="text-[10px] text-white/38">Width {(s.lineWidth || 2.8).toFixed(1)}</div>
                      </div>

                      <RibbonInline>
                        <RibbonSmallButton onClick={() => toggle(s.id)} title="Toggle visibility" active={!!visible[s.id]} className="w-9 px-0">
                          {visible[s.id] ? <IconVisible /> : <IconHidden />}
                        </RibbonSmallButton>
                        <RibbonSmallButton onClick={() => updateSolution(s.id, { showPath: !(s.showPath ?? true) })} title="Toggle path" active={s.showPath !== false} className="w-9 px-0">
                          <IconPath />
                        </RibbonSmallButton>
                        <div className="w-20">
                          <input
                            type="range"
                            min="0.5"
                            max="8"
                            step="0.1"
                            value={s.lineWidth || 2.8}
                            onChange={(e) => updateSolution(s.id, { lineWidth: parseFloat(e.target.value) })}
                            className="ribbon-range w-full cursor-pointer appearance-none bg-transparent"
                            title={`Line width ${(s.lineWidth || 2.8).toFixed(1)}`}
                          />
                        </div>
                        <RibbonSmallButton onClick={() => deleteSolution(s.id)} title="Delete solution" danger className="w-9 px-0">
                          <IconDelete />
                        </RibbonSmallButton>
                      </RibbonInline>

                      {openPicker === s.id && (
                        <ColorPickerPortal
                          anchorRef={{ current: btnRefs.current[s.id] as HTMLElement }}
                          color={s.color}
                          onChange={(c) => recolorSolution(s.id, c)}
                          onClose={() => setOpenPicker(null)}
                        />
                      )}
                    </RibbonListItem>
                  ))}
                  {solutions.length === 0 && (
                    <RibbonListItem className="justify-center text-[12px] text-white/35">
                      No solutions loaded.
                    </RibbonListItem>
                  )}
                </RibbonList>
              </RibbonGroup>
            </RibbonStrip>
          )}

          {activeTab === "view" && (
            <RibbonStrip>
              <RibbonGroup title="Scene">
                <RibbonInline className="gap-0.5">
                  <RibbonLargeButton label={showOrbits ? "Orbits On" : "Orbits Off"} meta="Global" icon={<IconOrbits />} onClick={toggleShowOrbits} active={showOrbits} />
                  <RibbonLargeButton label={centerBodyId ? "Recenter" : "Sun Center"} meta={centerBodyId ? "Reset" : "Default"} icon={<IconCenter />} onClick={() => setCenterBody(null)} disabled={!centerBodyId} active={!!centerBodyId} />
                  <RibbonLargeButton label="Bodies" meta={`${selectedBodies.length} selected`} icon={<IconBodies />} onClick={() => setShowBodyPanel(!showBodyPanel)} active={showBodyPanel || selectedBodies.length > 0} />
                </RibbonInline>
              </RibbonGroup>

              <RibbonGroup title="Selection">
                <RibbonInline className="w-[390px]">
                  <RibbonField label="Selection state" value={selectedBodies.length === 0 ? "None" : `${selectedBodies.length} active`} className="!min-w-[150px] w-[150px] shrink-0">
                    <div className="text-[10px] text-white/50">Browse and center bodies.</div>
                  </RibbonField>
                  <button
                    ref={bodyPanelBtnRef}
                    onClick={() => setShowBodyPanel(!showBodyPanel)}
                    className="inline-flex h-7 w-[104px] shrink-0 items-center justify-center rounded border border-white/8 bg-white/[0.03] px-2 text-[11px] text-white/70 transition-colors hover:bg-white/[0.06] hover:text-white"
                  >
                    Open panel
                  </button>
                  <RibbonSmallButton
                    onClick={() => usePlanetStore.setState({ selectedBodies: [] })}
                    disabled={selectedBodies.length === 0}
                    danger
                    className="w-[84px] shrink-0"
                  >
                    Clear
                  </RibbonSmallButton>
                </RibbonInline>
              </RibbonGroup>

              <RibbonGroup title="State">
                <RibbonInline className="w-[330px]">
                  <RibbonField label="Bodies in catalog" value={planets.length} className="min-w-[150px] flex-1">
                    <div className="text-[11px] text-white/45">Loaded mission bodies.</div>
                  </RibbonField>
                  <RibbonField label="Center target" value={centerBodyId ? "Body" : "Sun"} className="min-w-[150px] flex-1">
                    <div className="text-[11px] text-white/45">Current camera pivot.</div>
                  </RibbonField>
                </RibbonInline>
              </RibbonGroup>

              <BodyListPanel
                isOpen={showBodyPanel}
                onClose={() => setShowBodyPanel(false)}
                anchorRef={bodyPanelBtnRef}
                planets={planets}
                selectedBodies={selectedBodies}
                centerBodyId={centerBodyId}
                togglePlanet={togglePlanet}
                updatePlanetColor={updatePlanetColor}
                updatePlanetTypeColor={updatePlanetTypeColor}
                setCenterBody={setCenterBody}
                btnRefs={btnRefs}
                openPicker={openPicker}
                setOpenPicker={setOpenPicker}
              />
            </RibbonStrip>
          )}

          {activeTab === "movie" && (
            <RibbonStrip>
              <RibbonGroup title="Mode">
                <RibbonInline className="gap-0.5">
                  <RibbonLargeButton label={isMovieMode ? "Movie On" : "Movie Off"} meta="Timeline" icon={<IconMovie />} onClick={() => toggleMovieMode()} active={isMovieMode} />
                  <RibbonLargeButton label={logos.length > 0 ? `Logos ${logos.length}` : "Upload Logo"} meta="Branding" icon={logos.length > 0 ? <img src={logos[0].url} alt="Logo" className="h-5 w-5 object-contain" /> : <IconLogo />} asLabel>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        handleUploadLogo(e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                  </RibbonLargeButton>
                  <RibbonLargeButton label="Add Text" meta="Overlay" icon={<IconText />} onClick={() => addTextBox()} />
                  <RibbonLargeButton label="Present" meta="Fullscreen" icon={<IconPresentation />} onClick={async () => {
                    await enterFullscreen(getDefaultFullscreenTarget());
                    togglePresentationMode(true);
                  }} disabled={!isMovieMode} />
                </RibbonInline>
              </RibbonGroup>

              <RibbonGroup title="Typography">
                <RibbonInline className="w-[520px]">
                  <RibbonField label="Font" value={selectedTextBox?.fontFamily || "None selected"} className="min-w-[220px] flex-1">
                    <RibbonInline>
                      <select
                        className="h-7 flex-1 rounded border border-white/10 bg-[#1a1f26] px-2 text-[12px] text-white outline-none"
                        value={selectedTextBox?.fontFamily || "Inter"}
                        onChange={(e) => selectedTextBoxId && updateTextBox(selectedTextBoxId, { fontFamily: e.target.value })}
                        disabled={!selectedTextBox}
                      >
                        <option value="Inter">Inter</option>
                        <option value="Outfit">Outfit</option>
                        <option value="serif">Serif</option>
                        <option value="monospace">Mono</option>
                        <option value="cursive">Hand</option>
                      </select>
                      <RibbonSmallButton onClick={() => selectedTextBoxId && updateTextBox(selectedTextBoxId, { fontWeight: selectedTextBox?.fontWeight === 700 ? 400 : 700 })} disabled={!selectedTextBox} active={selectedTextBox?.fontWeight === 700} className="min-w-[42px]">B</RibbonSmallButton>
                      <RibbonSmallButton onClick={() => selectedTextBoxId && updateTextBox(selectedTextBoxId, { isItalic: !selectedTextBox?.isItalic })} disabled={!selectedTextBox} active={!!selectedTextBox?.isItalic} className="min-w-[42px] italic">I</RibbonSmallButton>
                    </RibbonInline>
                  </RibbonField>

                  <RibbonField label="Alignment & size" value={selectedTextBox ? `${Math.round((selectedTextBox.fontSize || 1) * 100)}%` : "Disabled"} className="min-w-[280px] flex-1">
                    <RibbonInline>
                      <RibbonSmallButton onClick={() => selectedTextBoxId && updateTextBox(selectedTextBoxId, { textAlign: "left" })} disabled={!selectedTextBox} active={selectedTextBox?.textAlign === "left"} className="w-7 px-0"><IconAlignLeft /></RibbonSmallButton>
                      <RibbonSmallButton onClick={() => selectedTextBoxId && updateTextBox(selectedTextBoxId, { textAlign: "center" })} disabled={!selectedTextBox} active={selectedTextBox?.textAlign === "center"} className="w-7 px-0"><IconAlignCenter /></RibbonSmallButton>
                      <RibbonSmallButton onClick={() => selectedTextBoxId && updateTextBox(selectedTextBoxId, { textAlign: "right" })} disabled={!selectedTextBox} active={selectedTextBox?.textAlign === "right"} className="w-7 px-0"><IconAlignRight /></RibbonSmallButton>
                      <input
                        type="range"
                        min="0.5"
                        max="5"
                        step="0.1"
                        value={selectedTextBox?.fontSize || 1}
                        onChange={(e) => selectedTextBoxId && updateTextBox(selectedTextBoxId, { fontSize: parseFloat(e.target.value) })}
                        className="ribbon-range flex-1 cursor-pointer appearance-none bg-transparent"
                        disabled={!selectedTextBox}
                      />
                      <button
                        ref={textColorBtnRef}
                        onClick={() => setOpenTextPicker((v) => !v)}
                        disabled={!selectedTextBox}
                        className="h-7 w-7 rounded border border-white/10"
                        style={{ backgroundColor: selectedTextBox?.color || "#ffffff" }}
                        title="Text color"
                      />
                    </RibbonInline>
                  </RibbonField>

                  {openTextPicker && selectedTextBoxId && (
                    <ColorPickerPortal
                      anchorRef={textColorBtnRef as React.RefObject<HTMLElement>}
                      color={selectedTextBox?.color || "#ffffff"}
                      onChange={(c) => updateTextBox(selectedTextBoxId, { color: c })}
                      onClose={() => setOpenTextPicker(false)}
                    />
                  )}
                </RibbonInline>
              </RibbonGroup>

              <RibbonGroup title="Keyframes">
                <RibbonInline className="gap-0.5">
                  <RibbonLargeButton
                    label={nearbyKeyframeId ? "Update" : "Add"}
                    meta={`${keyframes.length} frames`}
                    icon={nearbyKeyframeId ? <IconKeyframeUpdate /> : <IconKeyframeAdd />}
                    onClick={() => triggerKeyframeCapture()}
                    disabled={!isMovieMode}
                    active={!!nearbyKeyframeId}
                  />
                  <RibbonTwoRow className="w-[168px]">
                    <RibbonSmallButton onClick={() => nearbyKeyframeId && removeKeyframe(nearbyKeyframeId)} disabled={!isMovieMode || !nearbyKeyframeId} danger>
                      Delete current
                    </RibbonSmallButton>
                    <RibbonSmallButton onClick={() => confirm("Clear all keyframes?") && clearKeyframes()} disabled={!isMovieMode} danger>
                      Clear all
                    </RibbonSmallButton>
                    <RibbonSmallButton onClick={() => onMakeMovie?.()} className="col-span-2">
                      Movie workflow
                    </RibbonSmallButton>
                  </RibbonTwoRow>
                </RibbonInline>
              </RibbonGroup>

              <RibbonGroup title="Framing">
                <RibbonInline className="w-[360px]">
                  <RibbonField label="Aspect ratio" value={aspectRatio.toFixed(2)} className="min-w-[150px]">
                    <RibbonInline>
                      <RibbonSmallButton onClick={() => setAspectRatio(screenRatio)} className="min-w-[72px]">
                        Match
                      </RibbonSmallButton>
                      <div className="text-[10px] text-white/40">{screenRatioLabel}</div>
                    </RibbonInline>
                  </RibbonField>
                  <RibbonInline className="flex-wrap">
                    {ASPECT_PRESETS.map((preset) => (
                      <RibbonSmallButton
                        key={preset.label}
                        onClick={() => setAspectRatio(preset.value)}
                        active={Math.abs(aspectRatio - preset.value) < 0.01}
                        className="min-w-[52px]"
                      >
                        {preset.label}
                      </RibbonSmallButton>
                    ))}
                  </RibbonInline>
                </RibbonInline>
              </RibbonGroup>
            </RibbonStrip>
          )}
        </RibbonContent>
      </RibbonShell>
    </RibbonRoot>
  );
}
