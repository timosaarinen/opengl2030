import { ASSERTM } from './util.js'

export const uuid_from_u64 = (high, low) => {
  const arr = new BigUint64Array(2);
  arr[0] = BigInt(high);
  arr[1] = BigInt(low);
  return { type: 'uuid', uuid: arr }
}
export const uuid_from_bigint = (bigint) => {
  return uuid_from_u64(bigint >> 64n, bigint & 0xFFFFFFFFFFFFFFFFn)
}
export const uuid_generate = () => { // UUIDv7
  const now = BigInt(Date.now())
  const unixTime = now << 16n
  const randomBytes = new Uint8Array(8); crypto.getRandomValues(randomBytes)
  const randomPart = randomBytes.reduce((acc, byte, index) => acc | (BigInt(byte) << BigInt(8 * index)), 0n)
  const version = 0x7n << 12n
  const sequence = 0x000n
  const high = unixTime | version | sequence
  const low = randomPart
  return uuid_from_u64(high, low)  
}
export const uuid_from_string = (s) => {
  // TODO: cryptohash it
  const hexstr = '0x' + s.replace(/-/g, '')
  return uuid_from_bigint(BigInt(hexstr))
}
export const uuid_tostring = (uuid) => {
  ASSERTM(typeof uuid === 'object' && uuid.uuid, "not an uuid object") // TODO: might support BigUintArray[2]
  const arr = uuid.uuid
  const highhex = arr[0].toString(16).padStart(16, '0');
  const lowhex  = arr[1].toString(16).padStart(16, '0');
  return `${highhex.slice(0, 8)}-${highhex.slice(8, 12)}-${highhex.slice(12, 16)}-${lowhex.slice(0, 4)}-${lowhex.slice(4)}`;
}
//-------------------------------------------------------------------------------------------------
export const test_uuid = () => {
  const uuid = uuid_generate()
  console.log('Generated UUID:', uuid_tostring(uuid))

  const uuid_string = '110ec58a-a0f2-4ac4-8393-c866d813b8d1'
  const uuid2 = uuid_from_string(uuid_string)
  console.log('UUID from string:', uuid_tostring(uuid2))
}
