import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
    return (
        <div className="flex h-screen flex-col items-center justify-center bg-gray-50 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">404 - Page Non Trouvée</h2>
            <p className="mb-8 text-lg text-gray-600">Désolé, la page que vous recherchez n'existe pas.</p>
            <Link href="/">
                <Button className="bg-amber-600 hover:bg-amber-700">
                    Retour à l'accueil
                </Button>
            </Link>
        </div>
    )
}
