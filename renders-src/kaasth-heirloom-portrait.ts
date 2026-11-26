
import { Scene, PerspectiveCamera, Mesh, BoxGeometry, SphereGeometry, CylinderGeometry, MeshStandardMaterial, DirectionalLight, SkyAtmosphere, Color, Group, GLTFModel, SurfaceMaterial, Texture } from "@threert/scene";
// Kaasth hero room (BSX Agency). Variant: heirloom
export default function build() {
  const VARIANT = "heirloom";
  const scene = new Scene();
  const sun = new DirectionalLight(0xfff1dc, 95000);
  sun.name = "sun";
  sun.setSunAngles(24, 96);
  scene.add(sun);
  scene.environment = new SkyAtmosphere({ sun });
  const M = (name: string, color: number, roughness: number, extra: any = {}) => new MeshStandardMaterial({ name, color, roughness, ...extra });
  const tex = (id: string, map: "diff" | "nor_gl" | "rough", res = "1k") =>
    new Texture(`assets/polyhaven/tex/${id}/${id}_${map}_${res}.jpg`, map === "diff" ? "srgb" : "linear");
  // Limewash walls: smooth plaster scan tinted ivory. Floor: red sandstone slabs (2k for close-up detail).
  const plaster = new SurfaceMaterial({ name: "limewash", map: new Texture("assets/polyhaven/tex/yellow_plaster/kaasth_limewash_diff_1k.jpg", "srgb"), normalMap: tex("yellow_plaster", "nor_gl"), roughnessMap: tex("yellow_plaster", "rough"), color: [1, 1, 1], roughness: 1, normalScale: 0.3, worldScale: 2.2 });
  const stone = new SurfaceMaterial({ name: "red_sandstone", map: new Texture("assets/polyhaven/tex/red_sandstone_tiles/kaasth_sandstone_diff_2k.jpg", "srgb"), normalMap: tex("red_sandstone_tiles", "nor_gl", "2k"), roughnessMap: tex("red_sandstone_tiles", "rough", "2k"), color: [1, 1, 1], roughness: 0.8, worldScale: 1.8 });
  const teak = M("teak_dark", 0x3a2213, 0.42);
  const oak = M("oak_light", 0xc39868, 0.5);
  const brass = new MeshStandardMaterial({ name: "brass", color: new Color().setRGB(0.86, 0.68, 0.36), metalness: 1, roughness: 0.28 });
  const red = M("cotton_red", 0x7a2018, 0.95);
  const indigo = M("rug_indigo", 0x1c2140, 0.98);
  const madder = M("rug_madder", 0x6e2419, 0.98);
  const boucle = M("boucle", 0xebe3d6, 0.98);
  const oat = M("rug_oat", 0xd3c4aa, 0.98);
  const glow = new MeshStandardMaterial({ name: "lamp_glow", color: 0xfff1dc, emissive: new Color().setRGB(1.0, 0.72, 0.42), emissiveIntensity: 450, roughness: 0.9 });
  const room = new Group(); scene.add(room);
  const box = (n: string, w: number, h: number, d: number, x: number, y: number, z: number, m: MeshStandardMaterial) => { const o = new Mesh(new BoxGeometry(w, h, d), m); o.name = n; o.position.set(x, y, z); room.add(o); return o; };
  const cyl = (n: string, rt: number, rb: number, h: number, x: number, y: number, z: number, m: MeshStandardMaterial, seg = 40) => { const o = new Mesh(new CylinderGeometry(rt, rb, h, seg), m); o.name = n; o.position.set(x, y, z); room.add(o); return o; };
  const glb = (n: string, id: string, x: number, y: number, z: number, ry = 0, sc = 1) => { const g = new GLTFModel(`assets/polyhaven/models/${id}_1k.glb`); g.name = n; g.position.set(x, y, z); g.rotation.y = ry; g.scale.set(sc, sc, sc); room.add(g); return g; };
  const W = 7, H = 3.4, D = 6, T = 0.3;
  box("floor", W + 2*T, T, D + 2*T, 0, -T/2, 0, stone);
  box("ceiling", W + 2*T, T, D + 2*T, 0, H + T/2, 0, plaster);
  box("wall_back", W + 2*T, H, T, 0, H/2, -D/2 - T/2, plaster);
  box("wall_front", W + 2*T, H, T, 0, H/2, D/2 + T/2, plaster);
  box("wall_left", T, H, D, -W/2 - T/2, H/2, 0, plaster);
  box("courtyard", 40, 0.1, 40, W/2 + 20.3, -0.05, 0, stone);
  // right wall with a tall window filled by a diamond jaali
  const wx = W/2 + T/2, winW = 2.2, winH = 2.3, sill = 0.45, wz = -0.9, zMin = -D/2, zMax = D/2;
  box("wr_a", T, H, wz - winW/2 - zMin, wx, H/2, (zMin + wz - winW/2)/2, plaster);
  box("wr_b", T, H, zMax - (wz + winW/2), wx, H/2, (wz + winW/2 + zMax)/2, plaster);
  box("wr_sill", T, sill, winW, wx, sill/2, wz, plaster);
  box("wr_lintel", T, H - sill - winH, winW, wx, (H + sill + winH)/2, wz, plaster);
  const jaali = new Group(); jaali.position.set(wx, sill + winH/2, wz); jaali.rotation.x = Math.PI/4; room.add(jaali);
  const stoneJ = M("sandstone_jaali", 0xc8a77e, 0.9);
  for (let i = -14; i <= 14; i++) {
    const a = new Mesh(new BoxGeometry(0.06, 0.035, 4.2), stoneJ); a.position.set(0, i*0.17, 0); jaali.add(a);
    const b = new Mesh(new BoxGeometry(0.06, 4.2, 0.035), stoneJ); b.position.set(0, 0, i*0.17); jaali.add(b);
  }
  if (VARIANT === "heirloom") {
    box("rug", 3.4, 0.012, 2.4, 0.1, 0.006, -0.8, madder);
    box("rug_border", 3.0, 0.014, 2.0, 0.1, 0.007, -0.8, indigo);
    box("rug_field", 2.6, 0.016, 1.6, 0.1, 0.008, -0.8, madder);
    glb("day_bed", "vintage_day_bed", -0.7, 0, -2.5, 0);
    glb("pillows", "throw_pillows_01", -1.35, 0.72, -2.55, 0.2);
    // low carved chest as coffee table
    box("chest", 1.1, 0.38, 0.6, 0.1, 0.21, -0.8, teak);
    box("chest_band", 1.14, 0.05, 0.64, 0.1, 0.33, -0.8, brass);
    glb("brass_pot", "brass_pot_01", 0.1, 0.4, -0.8, 0);
    glb("almirah", "vintage_cabinet_01", 1.75, 0, -2.72, 0, 0.82);
    glb("armchair", "ArmChair_01", 2.25, 0, -0.35, -1.1);
    glb("brass_vase", "brass_vase_01", 0.58, 0, -2.7, 0, 1.1);
    cyl("chain", 0.006, 0.006, 1.0, -2.3, H - 0.5, -1.8, brass, 8);
    glb("diya_lantern", "brass_diya_lantern", -2.3, H - 1.2, -1.8, 0, 1.8);
  } else {
    box("rug", 3.2, 0.012, 2.3, 0.1, 0.006, -0.9, oat);
    glb("credenza", "modern_wooden_cabinet", -0.55, 0, -2.72, 0, 0.85);
    glb("vase", "ceramic_vase_02", -1.1, 0.58, -2.72, 0, 1.2);
    glb("vase_small", "ceramic_vase_02", -0.75, 0.58, -2.72, 0, 0.8);
    glb("coffee_table", "modern_coffee_table_01", 0.15, 0, -1.0, Math.PI / 2);
    glb("chair_left", "modern_arm_chair_01", -1.15, 0, -0.85, 1.25);
    glb("chair_right", "modern_arm_chair_01", 1.45, 0, -0.95, -1.35);
    glb("plant", "potted_plant_02", 1.25, 0.1, -2.6, 0, 1.5);
    cyl("lamp_pole", 0.012, 0.012, 1.55, -2.5, 0.78, -2.6, brass, 16);
    const g = new Mesh(new SphereGeometry(0.17, 48, 32), glow); g.position.set(-2.5, 1.68, -2.6); room.add(g);
  }
  const camera = new PerspectiveCamera(68, 3/4, 0.05, 200);
  camera.position.set(-1.75, 1.3, 2.75);
  camera.lookAt(0.35, 0.95, -1.6);
  camera.setManualExposure(9.8);
  scene.add(camera);
  return { scene, camera, options: { name: "kaasth-heirloom-portrait", overrides: { post: {
    bloom: { intensity: 0, threshold: 1.0, sizeScale: 3 },
    vignette: 0, filmGrain: 0, chromaticAberration: 0,
    colorGrading: { whiteTemp: 5900, saturation: 0.96, contrast: 1.1, shadowsGain: 0.97, highlightsGain: 1.0 },
  } } } };
}
