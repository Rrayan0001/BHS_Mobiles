import styles from './WhatsAppButton.module.css'

const WHATSAPP_NUMBER = '919632564054'
const WHATSAPP_MESSAGE = encodeURIComponent(
    "Hi Nawaz Mobiles! I'm interested in your products and need assistance."
)

export default function WhatsAppButton() {
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`

    return (
        <a
            href={whatsappUrl}
            className={styles.button}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with Nawaz Mobiles on WhatsApp"
        >
            <svg
                className={styles.icon}
                viewBox="0 0 32 32"
                role="img"
                aria-hidden="true"
            >
                <path
                    fill="currentColor"
                    d="M19.11 17.44c-.27-.14-1.57-.77-1.81-.86-.24-.09-.42-.14-.59.14-.17.27-.68.86-.83 1.04-.15.18-.31.2-.58.07-.27-.14-1.14-.42-2.16-1.35-.8-.71-1.34-1.59-1.5-1.86-.15-.27-.02-.41.12-.54.13-.12.27-.31.41-.46.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.48-.07-.14-.59-1.42-.81-1.95-.21-.51-.43-.44-.59-.45-.15-.01-.33-.01-.51-.01-.18 0-.48.07-.73.34-.25.27-.96.94-.96 2.3s.99 2.68 1.13 2.86c.14.18 1.95 2.97 4.72 4.16.66.28 1.17.45 1.58.58.66.21 1.27.18 1.75.11.54-.08 1.57-.64 1.79-1.25.22-.61.22-1.13.15-1.25-.06-.11-.24-.18-.51-.32z"
                />
                <path
                    fill="currentColor"
                    d="M16 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.25.59 4.45 1.71 6.38L3 29l6.79-1.78A12.75 12.75 0 0 0 16 28.8c7.06 0 12.8-5.74 12.8-12.8S23.06 3.2 16 3.2zm0 23.31c-1.95 0-3.87-.52-5.55-1.5l-.4-.23-4.03 1.06 1.07-3.92-.26-.41a10.3 10.3 0 0 1-1.58-5.52c0-5.69 4.63-10.31 10.31-10.31 2.75 0 5.33 1.07 7.28 3.02a10.23 10.23 0 0 1 3.03 7.29c0 5.68-4.63 10.31-10.31 10.31z"
                />
            </svg>
            <span className={styles.label}>WhatsApp</span>
        </a>
    )
}
