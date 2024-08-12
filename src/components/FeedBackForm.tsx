import { type FormEvent, useState } from "react";
import { getApps, initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBEdV3wqop4uMQlK8_ENOBc0L7OvUzDAP4",
  authDomain: "nubies-58bbd.firebaseapp.com",
  databaseURL: "https://nubies-58bbd-default-rtdb.firebaseio.com",
  projectId: "nubies-58bbd",
  storageBucket: "nubies-58bbd.appspot.com",
  messagingSenderId: "649412933733",
  appId: "1:649412933733:web:ac8a0a93f0087017b56e8c"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

export default function Form() {
    const [responseMessage, setResponseMessage] = useState("");
    const [isStudent, setIsStudent] = useState<boolean | null>(null);
    const [selectedSchedules, setSelectedSchedules] = useState<string[]>([]);
    const [scheduleError, setScheduleError] = useState<string | null>(null);

    async function submit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();

        // Validar que al menos un horario esté seleccionado
        if (selectedSchedules.length === 0) {
            setScheduleError("Debes seleccionar al menos un horario.");
            return;
        } else {
            setScheduleError(null);
        }
        
        const concatenatedSchedules = selectedSchedules.join(", ");
        const formData = new FormData(e.target as HTMLFormElement);

        formData.set("schedule", concatenatedSchedules);

        const data = Object.fromEntries(formData.entries());

        try {
            // Guardar los datos en Firestore
            await addDoc(collection(db, "registrations"), {
                name: data.name,
                email: data.email,
                phone_number: data.phone_number,
                telegram_username: data.telegram_username,
                occupation: data.occupation,
                code: data.code || null,
                non_student_occupation: data.non_student_occupation || null,
                motivation: data.motivation,
                schedule: data.schedule,
                timestamp: new Date(),
            });
            
            setResponseMessage("Registro exitoso. ¡Gracias por inscribirte!");

            // Redirigir a otra página después de enviar el formulario
            window.location.href = "/thank-you"; // Cambia esta URL a la página de destino deseada
        } catch (error) {
            console.error("Error al registrar: ", error);
            setResponseMessage("Hubo un error al enviar el formulario. Por favor, intenta nuevamente.");
        }
    }

    function handleScheduleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const { value, checked } = e.target;

        if (checked) {
            setSelectedSchedules([...selectedSchedules, value]);
        } else {
            setSelectedSchedules(selectedSchedules.filter(schedule => schedule !== value));
        }
    }

    return (
        <div className="p-3">
        <form onSubmit={submit} className="space-y-6 p-6 bg-gradient-animated bg-400% animate-gradient shadow-md rounded-lg max-w-screen-sm mx-auto">
            <label htmlFor="name" className="block text-xl">
                Nombre completo:
                <input type="text" id="name" name="name" autoComplete="name" required className="block w-full p-2 mt-1 border rounded"/>
            </label>

            <label htmlFor="email" className="block text-xl">
                Correo institucional o personal:
                <input type="text" id="email" name="email" autoComplete="email" required className="block w-full p-2 mt-1 border rounded"/>
            </label>

            <label htmlFor="phone_number" className="block text-xl">
                Número de teléfono:
                <input type="text" id="phone_number" name="phone_number" autoComplete="phone_number" required className="block w-full p-2 mt-1 border rounded"/>
            </label>

            <label htmlFor="telegram_username" className="block text-xl">
                ¿Tienes telegram? ¿Cuál es tu @ (Nombre de Usuario)? Responde "No tengo" si no lo tienes:
                <input type="text" id="telegram_username" name="telegram_username" autoComplete="telegram_username" required className="block w-full p-2 mt-1 border rounded"/>
            </label>

            <label htmlFor="occupation" className="block text-xl">
                Eres:
                <select id="occupation" name="occupation" className="block w-full p-2 mt-1 border rounded" onChange={(e) => setIsStudent(e.target.value === "Estudiante" ? true : e.target.value === "No estudiante" ? false : null)} required>
                    <option value="">Seleccione una opción</option>
                    <option value="Estudiante">Estudiante</option>
                    <option value="No estudiante">No estudiante</option>
                </select>
            </label>

            {isStudent === true && (
                <label htmlFor="code" className="block text-xl">
                    Tu Código estudiantil:
                    <input type="text" id="code" name="code" autoComplete="code" required className="block w-full p-2 mt-1 border rounded"/>
                </label>
            )}

            {isStudent === false && (
                <label htmlFor="non_student_occupation" className="block text-xl">
                    ¿Qué haces actualmente?:
                    <input type="text" id="non_student_occupation" name="non_student_occupation" autoComplete="non_student_occupation" required className="block w-full p-2 mt-1 border rounded"/>
                </label>
            )}

            <label htmlFor="motivation" className="block text-xl">
                ¿Por qué te gustaría ingresar a este grupo de trabajo o tienes algún tema que te gustaría tratar durante el curso?:
                <input type="text" id="motivation" name="motivation" autoComplete="motivation" required className="block w-full p-2 mt-1 border rounded"/>
            </label>

            {scheduleError && <p className="text-red-500">{scheduleError}</p>}
            <label htmlFor="schedule" className="block text-xl">
                ¿A qué horario deseas ingresar? Selecciona uno o todos los que te sirvan, serás asignado según disponibilidad:
            </label>
            <div className="space-y-2 text-xl">
                <label className="flex items-center">
                    <input type="checkbox" id="L2pm4pm" name="schedule" value="Lunes 2pm - 4pm (Facultad de ingeniería)" className="mr-2" onChange={handleScheduleChange} />
                    Lunes 2pm - 4pm (Facultad de ingeniería)
                </label>

                <label className="flex items-center">
                    <input type="checkbox" id="W2pm4pm" name="schedule" value="Miércoles 2pm - 4pm (Facultad de ingeniería)" className="mr-2" onChange={handleScheduleChange} />
                    Miércoles 2pm - 4pm (Facultad de ingeniería)
                </label>

                <label className="flex items-center">
                    <input type="checkbox" id="Th8am10am" name="schedule" value="Jueves 8am - 10am (Facultad de ingeniería)" className="mr-2" onChange={handleScheduleChange} />
                    Jueves 8am - 10am (Facultad de ingeniería)
                </label>

                <label className="flex items-center">
                    <input type="checkbox" id="F12pm2pm" name="schedule" value="Viernes 12m - 2pm (Facultad de ingeniería)" className="mr-2" onChange={handleScheduleChange} />
                    Viernes 12m - 2pm (Facultad de ingeniería)
                </label>

                <label className="flex items-center">
                    <input type="checkbox" id="F2pm4pm" name="schedule" value="Viernes 2pm - 4pm (Facultad de ingeniería)" className="mr-2" onChange={handleScheduleChange} />
                    Viernes 2pm - 4pm (Facultad de ingeniería)
                </label>

                <label className="flex items-center">
                    <input type="checkbox" id="W12pm2pm" name="schedule" value="Miércoles 12m - 2pm (Macarena)" className="mr-2" onChange={handleScheduleChange} />
                    Miércoles 12m - 2pm (Macarena)
                </label>
            </div>

            <button type="submit" className="w-full p-2 mt-4 bg-black text-white rounded hover:bg-blue-600">Enviar</button>

            {responseMessage && <p className="mt-4 text-green-500">{responseMessage}</p>}
        </form>
        </div>
    )
}
