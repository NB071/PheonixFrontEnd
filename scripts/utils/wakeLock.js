/* 
[~] This is the feature mentioned on the planning phase.

[*] It allows us to stop the device screen from going to sleep 
without hacky work arounds that are likely to drain 
the battery of the device

[=]  Wake Lock only works on active tabs/windows

[!] This feature may not be supported on some browsers or devices.
In such cases, the function will return early without any intruptions.
*/

let wakelock;

const canWakeLock = () => "wakeLock" in navigator;

// Request for prevention of screen lock
export default async function lockWakeState() {
  if (!canWakeLock()) return;
  try {
    wakelock = await navigator.wakeLock.request();
    wakelock.addEventListener("release", () => {
      console.info("Screen Wake State Locked:", !wakelock.released);
    });
    console.info("Screen Wake State Locked:", !wakelock.released);
  } catch (e) {
    console.error("Failed to lock wake state with reason:", e.message);
  }
}

// Request for release of screen lock - which we won't use for now
// This code can be used in settings where it can be implemented as a switch feature.
export function releaseWakeState() {
  if (wakelock) wakelock.release();
  wakelock = null;
}
