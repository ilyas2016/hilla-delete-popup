import ContactRecord from 'Frontend/generated/com/example/application/services/CRMService/ContactRecord';
import {useEffect, useState} from 'react';
import {CRMService} from "Frontend/generated/endpoints";
import {Grid} from "@hilla/react-components/Grid";
import {GridColumn} from "@hilla/react-components/GridColumn";
import ContactForm from "Frontend/views/contacts/ContactForm";
import {Dialog} from "@hilla/react-components/Dialog";

export default function ContactsView() {
    const [contacts, setContacts] = useState<ContactRecord[]>([]);
    const [selected, setSelected] = useState<ContactRecord | null | undefined>();
    const [dialogOpened, setDialogOpened] = useState<boolean>(false);

    useEffect(() => {
        CRMService.findAllContacts().then(setContacts);
    }, []);

    async function onContactSaved(contact: ContactRecord) {
        const saved = await CRMService.save(contact)
        if (contact.id) {
            setContacts(contacts => contacts.map(current => current.id === saved.id ? saved : current));
        } else {
            setContacts(contacts => [...contacts, saved]);
        }
        setSelected(saved);
        setDialogOpened(false);
    }

    async function onRemove(contact: ContactRecord){
        await CRMService.deleteContact(contact.id);
        setContacts(contacts => contacts.filter(current => current.id !== contact.id));
        setSelected(null);
        setDialogOpened(false);
    }

    return (
        <div className="p-m flex gap-m">
            <Grid
                items={contacts}
                onActiveItemChanged={e => {
                    setSelected(e.detail.value);
                    setDialogOpened(true);
                }}
                selectedItems={[selected]}>

                <GridColumn path="firstName"/>
                <GridColumn path="lastName"/>
                <GridColumn path="email"/>
                <GridColumn path="company.name" header="Company name"/>
            </Grid>

            <Dialog
                theme="no-padding"
                header-title="Edit Record"
                opened={dialogOpened}
            >
                <ContactForm contact={selected} onSubmit={onContactSaved} onRemove={onRemove}/>
            </Dialog>
        </div>
    );
}