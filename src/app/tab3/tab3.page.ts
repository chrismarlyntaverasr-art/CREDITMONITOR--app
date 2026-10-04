import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { addIcons } from 'ionicons';

import {
  walletOutline,
  checkmarkCircleOutline,
  informationCircleOutline,
  qrCodeOutline
} from 'ionicons/icons';

import {
  BarcodeScanner,
  BarcodeFormat
} from '@capacitor-mlkit/barcode-scanning';


interface AvailableCredit {
  bankName: string;
  logoColor: string;
  availableAmount: number;
  creditType: string;
  description: string;
  interestRate: string;
}


interface CreditOffer {
  banco: string;
  tipo: string;
  monto: string;
  tasa: string;
  plazo: string;
}


@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})


export class Tab3Page {


  // ============================================================
  // CRÉDITOS DISPONIBLES
  // ============================================================

  credits: AvailableCredit[] = [

    {
      bankName: 'Banco Popular',
      logoColor: '#003366',
      availableAmount: 250000.00,
      creditType: 'Extracrédito Pre-aprobado',
      description:
        'Línea de crédito adicional disponible de inmediato sin afectar la cuota de tu tarjeta principal.',
      interestRate: '14.5% anual'
    },

    {
      bankName: 'Banco BHD',
      logoColor: '#00875a',
      availableAmount: 120000.00,
      creditType: 'Aumento de Límite',
      description:
        'Incremento pre-aprobado para tu tarjeta Mastercard Black disponible a solicitud.',
      interestRate: '18.0% anual'
    },

    {
      bankName: 'Scotiabank',
      logoColor: '#cc0000',
      availableAmount: 300000.00,
      creditType: 'Préstamo Pre-Aprobado',
      description:
        'Oferta especial de crédito personal con desembolso inmediato a tu cuenta.',
      interestRate: '13.9% anual'
    }

  ];


  // ============================================================
  // VARIABLES DEL ESCÁNER QR
  // ============================================================

  ofertaEscaneada: CreditOffer | null = null;

  mensajeEscaneo: string = '';

  resultadoQR: string = '';


  // ============================================================
  // CONSTRUCTOR
  // ============================================================

  constructor(
    private cdr: ChangeDetectorRef
  ) {

    addIcons({

      walletOutline,

      checkmarkCircleOutline,

      informationCircleOutline,

      qrCodeOutline

    });

  }


  // ============================================================
  // ESCANEAR OFERTA QR
  // ============================================================

  async escanearOferta() {

    try {

      // Limpiar resultados anteriores

      this.mensajeEscaneo = '';

      this.ofertaEscaneada = null;

      this.resultadoQR = '';


      console.log(
        'Iniciando escaneo QR...'
      );


      // Abrir escáner nativo

      const { barcodes } =
        await BarcodeScanner.scan({

          formats: [
            BarcodeFormat.QrCode
          ],

          autoZoom: true

        });


      console.log(
        'Resultado completo del escaneo:',
        barcodes
      );


      // Obtener contenido del primer código

      const valor =
        barcodes[0]?.rawValue;


      console.log(
        'Contenido del QR:',
        valor
      );


      // Si no encontró código

      if (!valor) {

        this.mensajeEscaneo =
          'No se detectó ningún código QR.';

        this.cdr.detectChanges();

        return;

      }


      // ========================================================
      // GUARDAR RESULTADO DEL QR
      // ========================================================

      this.resultadoQR = valor;


      this.mensajeEscaneo =
        'Código QR escaneado correctamente.';


      console.log(
        'Resultado QR guardado:',
        this.resultadoQR
      );


      // ========================================================
      // FORZAR ACTUALIZACIÓN DE LA INTERFAZ
      // ========================================================

      this.cdr.detectChanges();


      console.log(
        'Interfaz actualizada después del escaneo.'
      );


    } catch (error) {


      console.error(
        'Error al escanear el código QR:',
        error
      );


      this.mensajeEscaneo =
        'No fue posible escanear el código QR.';


      this.cdr.detectChanges();

    }

  }


  // ============================================================
  // MOSTRAR OFERTA
  // ============================================================

  mostrarOferta() {


    console.log(
      'Botón MOSTRAR OFERTA presionado.'
    );


    // Verificar que exista un resultado

    if (!this.resultadoQR) {

      this.mensajeEscaneo =
        'Primero debes escanear una oferta.';

      this.cdr.detectChanges();

      return;

    }


    console.log(
      'Mostrando oferta con QR:',
      this.resultadoQR
    );


    // Procesar información

    this.procesarResultadoQR(
      this.resultadoQR
    );


    // Actualizar pantalla

    this.cdr.detectChanges();

  }


  // ============================================================
  // PROCESAR INFORMACIÓN DEL QR
  // ============================================================

  private procesarResultadoQR(
    valor: string
  ) {


    console.log(
      'Procesando QR:',
      valor
    );


    // Separar los datos usando |

    const partes =
      valor.split('|');


    console.log(
      'Partes del QR:',
      partes
    );


    // Validar estructura

    if (

      partes.length !== 6 ||

      partes[0] !== 'CREDITMONITOR'

    ) {


      this.ofertaEscaneada = null;


      this.mensajeEscaneo =
        'El código QR no corresponde a una oferta de crédito válida.';


      this.cdr.detectChanges();


      return;

    }


    // ==========================================================
    // CREAR OBJETO CON LA OFERTA
    // ==========================================================

    this.ofertaEscaneada = {

  banco: partes[1] === 'BANCO BHD'
    ? 'Banco BHD'
    : partes[1],

  tipo: partes[2] === 'PRESTAMO PERSONAL'
    ? 'Préstamo Personal'
    : partes[2],

  monto: partes[3],

  tasa: partes[4],

  plazo: partes[5]

};


    this.mensajeEscaneo =
      'Oferta de crédito escaneada correctamente.';


    console.log(
      'Oferta procesada:',
      this.ofertaEscaneada
    );


    this.cdr.detectChanges();

  }


  // ============================================================
  // LIMPIAR OFERTA
  // ============================================================

  limpiarOferta() {


    this.ofertaEscaneada = null;

    this.resultadoQR = '';

    this.mensajeEscaneo = '';


    console.log(
      'Oferta limpiada. Lista para un nuevo escaneo.'
    );


    this.cdr.detectChanges();

  }

}