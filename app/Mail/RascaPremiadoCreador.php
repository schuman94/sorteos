<?php

namespace App\Mail;

use App\Models\Premio;
use App\Models\Rasca;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class RascaPremiadoCreador extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public User $usuario;
    public Rasca $rasca;
    public Premio $premio;

    /**
     * Create a new message instance.
     */
    public function __construct(User $usuario, Rasca $rasca, Premio $premio)
    {
        $this->usuario = $usuario;
        $this->rasca = $rasca;
        $this->premio = $premio;
    }
    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '¡Un usuario ha ganado un premio en tu colección de rascas!'
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.rasca.creador',
            with: [
                'usuario' => $this->usuario,
                'rasca'   => $this->rasca,
                'premio'  => $this->premio,
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
