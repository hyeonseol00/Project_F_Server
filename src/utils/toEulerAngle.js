export default function toEulerAngles(directionVector) {
  const { x, z } = directionVector;

  // Yaw (y축 회전)
  let yaw = -(Math.atan2(z, x) * 180) / Math.PI;

  // 범위를 0~360도로 조정
  if (yaw < 0) {
    yaw += 360;
  }

  return yaw;
}
