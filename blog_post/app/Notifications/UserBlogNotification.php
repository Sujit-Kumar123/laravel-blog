<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserBlogNotification extends Notification
{
    use Queueable;
    public $data_notify;

    /**
     * Create a new notification instance.
     */
    public function __construct($data_notify)
    {
        $this->data_notify=$data_notify;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }
    public function toArray(object $notifiable): array
    {
        return [
            'id'=>$this->data_notify['id'],
            'name'=>$this->data_notify['name'],
            'blog_url_with_id'=>$this->data_notify['blog_url_with_id']
        ];
    }
}
