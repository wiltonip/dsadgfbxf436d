package com.threering.api;

import com.threering.api.dom.ModelOverview;
import com.threering.api.service.ShapewaysApiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.List;

import static javax.xml.bind.DatatypeConverter.printHexBinary;


@RestController
public class SomeController {

    private final Path rootLocation;

    private Base64.Encoder base64Encoder;
    private MessageDigest messageDigest;

    @Autowired
    private ShapewaysApiService apiService;

    @Autowired
    public SomeController() {
        rootLocation = Paths.get("");
        base64Encoder = Base64.getEncoder();
        try {
            messageDigest = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
    }

    @GetMapping(value = "/status", produces = "application/json")
    public String status() {
        return apiService.status();
    }

    @GetMapping(value = "/materials", produces = "application/json")
    public String materials() {
        return apiService.materials();
    }

    @GetMapping(value = "/pricing", produces = "application/json")
    public String greeting(@RequestParam(name="name", required=false, defaultValue="World") String name) {
        return apiService.instantPricing(
                0.00000025, 0.0008,
                0.01, 0.01,
                0.01, 0.01,
                0.01, 0.01);
    }

    @GetMapping(value = "/model/{modelId}", produces = "application/json")
    public String getModel(@PathVariable Long modelId) throws IOException {
        return apiService.getModel(modelId);
    }

    @GetMapping(value = "/model", produces = "application/json")
    public List<ModelOverview> getModels() throws IOException {
        return apiService.getAllModels();
    }

    @PostMapping(value = "/model", produces = "application/json")
    public String uploadModel() throws IOException {
        String filename = "ring.stl";
        Path path = Paths.get(filename);
        byte[] data = Files.readAllBytes(path);
        String base64Content = new String(base64Encoder.encode(data));
        String hash = printHexBinary(messageDigest.digest(data));
        return apiService.uploadModel(hash + "-" + filename, base64Content);
    }

    @GetMapping(value = "/checkout", produces = "application/json") // Beta feature
    public String checkoutModel(
            @RequestParam(value = "model", required = true) Long model,
            @RequestParam(value = "material", required = true) Long material
            ) {
        return apiService.checkout(model, material);
    }

}
