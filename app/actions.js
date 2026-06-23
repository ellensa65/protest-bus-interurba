'use server';

import { revalidatePath } from 'next/cache';
import { supabase } from '../lib/supabase';

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

    // Validació i preparació de les dades del formulari
    const { operator, delay, comment } = reportData || {};

    if (!operator || typeof operator !== 'string') {
      return { success: false, error: "L'operadora no és vàlida." };
    }

    const parsedDelay = parseInt(delay, 10);
    if (isNaN(parsedDelay) || parsedDelay < 0) {
      return { success: false, error: "El retard ha de ser un número de minuts positiu o zero." };
    }

    const cleanComment = (comment || '').trim();
    if (cleanComment.length > 200) {
      return { success: false, error: "El comentari no pot tenir més de 200 caràcters." };
    }

    // Inserció real a la taula 'incidencies' de Supabase
    const { error: dbError } = await supabase
      .from('Incidencies')
      .insert([
        {
          operadora_id: operator,
          retard: parsedDelay,
          comentari: cleanComment || null
        }
      ]);

    if (dbError) {
      console.error("Error al registrar la incidència a Supabase:", dbError);
      return { success: false, error: "S'ha produït un error al registrar la incidència a la base de dades." };
    }

    console.log("Incidència registrada correctament a Supabase.");

    // Revalidar el path principal per refrescar el Retardòmetre del servidor instantàniament
    revalidatePath('/');

    return { success: true };
  } catch (error) {
    console.error("Error en submitReportAction:", error);
    return { success: false, error: "Error de connexió en validar o registrar la incidència." };
  }
}


