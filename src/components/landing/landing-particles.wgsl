struct Uniforms {
  resolution: vec2f,
  time: f32,
  padding: f32,
  pointer: vec2f,
  spare: vec2f,
}
struct Particle {
  @builtin(position) position: vec4f,
  @location(0) local: vec2f,
  @location(1) opacity: f32,
}
@group(0) @binding(0) var<uniform> scene: Uniforms;

@vertex
fn vertex(@builtin(vertex_index) vertexIndex: u32, @builtin(instance_index) index: u32) -> Particle {
  let corners = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
    vec2f(-1.0, 1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0)
  );
  let column = f32(index % 90u);
  let row = f32(index / 90u);
  let x = (column / 89.0 - 0.5) * 4.8;
  let z = (row / 59.0 - 0.5) * 3.2;
  let phase = scene.time * 0.22;
  let wave = sin(x * 1.6 + z * 1.2 + phase) * 0.38
    + cos(z * 2.4 - x * 0.65 + phase * 0.7) * 0.24;
  let horizontal = 0.54 + (x + z * 0.32) * 0.18 + scene.pointer.x * 0.012;
  let vertical = 0.51 + z * 0.17 - wave * 0.25 + scene.pointer.y * 0.008;
  let edge = smoothstep(0.0, 0.20, column / 89.0)
    * (1.0 - smoothstep(0.80, 1.0, column / 89.0))
    * smoothstep(0.0, 0.15, row / 59.0)
    * (1.0 - smoothstep(0.82, 1.0, row / 59.0));
  let radius = (1.05 + (z + 1.6) * 0.18) * min(scene.resolution.x / 900.0, 1.5);
  let local = corners[vertexIndex];
  var output: Particle;
  output.position = vec4f(
    vec2f(horizontal * 2.0 - 1.0, 1.0 - vertical * 2.0)
      + local * radius * 2.0 / scene.resolution,
    0.0, 1.0
  );
  output.local = local;
  output.opacity = edge * (0.18 + (wave + 0.62) * 0.37);
  return output;
}

@fragment
fn fragment(input: Particle) -> @location(0) vec4f {
  let alpha = (1.0 - smoothstep(0.15, 1.0, length(input.local))) * input.opacity;
  return vec4f(vec3f(alpha), alpha);
}
