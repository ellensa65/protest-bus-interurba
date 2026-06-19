'use server';

export async function submitReportAction(reportData, turnstileToken) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;
  if (!secretKey) {
    console.error("Falta la variable d'entorn TURNSTILE_SECRET_KEY");
    return { success: false, error: "Error de configuració al servidor." };
  }

  if (!turnstileToken) {
    return { success: false, error: "Verificació de seguretat no completada." };
  }

  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secret: secretKey,
        response: turnstileToken,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      return {
        success: false,
        error: "La verificació de seguretat ha fallat. Ets un bot?",
        details: data['error-codes'] || []
      };
    }

    // Lògica per desar la incidència (en aquest cas, log a la consola)
    console.log("Incidència registrada amb èxit:", {
      ...reportData,
      verifiedAt: data.challenge_ts,
      hostname: data.hostname,
    });

    return { success: true };
  } catch (error) {
    console.error("Error validant Turnstile:", error);
    return { success: false, error: "Error de connexió en validar la seguretat." };
  }
}
