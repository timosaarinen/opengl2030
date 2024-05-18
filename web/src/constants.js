//------------------------------------------------------------------------
// Constants, partly WebGL compatible. Custom 0xF000+
//------------------------------------------------------------------------
// culling
export const CULL_NONE                = 0xF000
export const CULL_CCW_FACES           = 0xF001
export const CULL_CW_FACES            = 0xF002
// primitives         
export const POINTS                   = 0x0000  // primitive: points
export const LINES                    = 0x0001  // primitive: lines
//export const LINE_LOOP              = 0x0002  // primitive: line loop (TODO: ever used? ..can keep just-in-case? Unless GPUs drop it / too sub-optimal)
export const LINE_STRIP               = 0x0003  // primitive: line strip
export const TRIANGLES                = 0x0004  // primitive: triangles
export const TRIANGLE_STRIP           = 0x0005  // primitive: triangle strip
export const TRIANGLE_FAN             = 0x0006  // primitive: triangle fan
// buffers          
export const STATIC_DRAW              = 0x88E4  // hint: updated once or very rarely
export const DYNAMIC_DRAW             = 0x88E8  // hint: updated often
export const VERTEX_BUFFER            = 0x8892  // ARRAY_BUFFER, vertex data array buffer
export const INDEX_BUFFER             = 0x8764  // ELEMENT_ARRAY_BUFFER
// blending factors
export const ZERO                     = 0x0000
export const ONE                      = 0x0001
export const SRC_COLOR                = 0x0300
export const ONE_MINUS_SRC_COLOR      = 0x0301
export const SRC_ALPHA                =	0x0302
export const ONE_MINUS_SRC_ALPHA      = 0x0303
export const DST_ALPHA                = 0x0304
export const ONE_MINUS_DST_ALPHA      = 0x0305
export const DST_COLOR                = 0x0306
export const ONE_MINUS_DST_COLOR      = 0x0307
export const SRC_ALPHA_SATURATE       = 0x0308
export const CONSTANT_COLOR           = 0x8001
export const ONE_MINUS_CONSTANT_COLOR = 0x8002
export const CONSTANT_ALPHA           = 0x8003
export const ONE_MINUS_CONSTANT_ALPHA = 0x8004
// blending op/equations
export const FUNC_ADD                 = 0x8006
export const FUNC_SUBTRACT            = 0x800A
export const FUNC_REVERSE_SUBTRACT    =	0x800B
// TODO: boolean enable/disable renderstates - keep that kind of API, gl_enable(renderstate, enable)?
export const CULL_FACE                = 0x0B44
export const BLEND                    =	0x0BE2
export const DEPTH_TEST               = 0x0B71
export const DITHER                   = 0x0BD0
export const POLYGON_OFFSET_FILL      = 0x8037
export const SAMPLE_ALPHA_TO_COVERAGE = 0x809E
export const SAMPLE_COVERAGE          = 0x80A0
export const SCISSOR_TEST             = 0x0C11
export const STENCIL_TEST             = 0x0B90
// TODO: barriers, alpha-to-coverage, ...